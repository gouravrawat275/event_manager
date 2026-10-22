import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import ApiError from "../utils/ApiError.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryUpload.js";

export const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      city,
      dateFrom,
      dateTo,
      minPrice,
      maxPrice,
      status,
      sort = "-date",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};
    query.status = status || "published";

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (city) query.city = new RegExp(`^${city}$`, "i");
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query).populate("category", "name icon slug").sort(sort).skip(skip).limit(limitNum),
      Event.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      events,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: "published", isFeatured: true })
      .populate("category", "name icon slug")
      .sort("-createdAt")
      .limit(8);
    res.status(200).json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: "published", date: { $gte: new Date() } })
      .populate("category", "name icon slug")
      .sort("date")
      .limit(8);
    res.status(200).json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

export const getPopularEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: "published" })
      .populate("category", "name icon slug")
      .sort("-bookedSeats")
      .limit(8);
    res.status(200).json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    const event = await Event.findOne(query).populate("category", "name icon slug");

    if (!event) throw new ApiError(404, "Event not found.");

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const getRelatedEvents = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, "Event not found.");

    const related = await Event.find({
      _id: { $ne: event._id },
      category: event.category,
      status: "published",
    })
      .populate("category", "name icon slug")
      .limit(4);

    res.status(200).json({ success: true, events: related });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const images = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "event-hub/events");
        images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    const event = await Event.create({
      ...req.body,
      organizer: {
        name: req.body.organizerName,
        email: req.body.organizerEmail,
        phone: req.body.organizerPhone,
      },
      images,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, "Event not found.");

    const newImages = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "event-hub/events");
        newImages.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    const updates = { ...req.body };
    if (req.body.organizerName || req.body.organizerEmail || req.body.organizerPhone) {
      updates.organizer = {
        name: req.body.organizerName || event.organizer.name,
        email: req.body.organizerEmail || event.organizer.email,
        phone: req.body.organizerPhone || event.organizer.phone,
      };
    }
    if (newImages.length > 0) {
      updates.images = [...event.images, ...newImages];
    }

    Object.assign(event, updates);
    await event.save();

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, "Event not found.");

    const activeBookings = await Booking.countDocuments({
      eventId: event._id,
      bookingStatus: { $in: ["pending", "approved"] },
    });
    if (activeBookings > 0) {
      throw new ApiError(400, "Cannot delete an event with active bookings. Cancel it instead.");
    }

    for (const img of event.images) {
      await deleteFromCloudinary(img.publicId);
    }

    await event.deleteOne();

    res.status(200).json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["draft", "published", "cancelled", "completed"].includes(status)) {
      throw new ApiError(400, "Invalid status value.");
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!event) throw new ApiError(404, "Event not found.");

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const removeEventImage = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, "Event not found.");

    const { publicId } = req.body;
    if (!publicId) throw new ApiError(400, "publicId is required.");

    await deleteFromCloudinary(publicId);
    event.images = event.images.filter((img) => img.publicId !== publicId);
    await event.save();

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};
