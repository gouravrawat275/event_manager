import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import ApiError from "../utils/ApiError.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryUpload.js";

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;

    if (req.file) {
      if (user.avatar?.publicId) {
        await deleteFromCloudinary(user.avatar.publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, "event-hub/avatars");
      user.avatar = { url: result.secure_url, publicId: result.public_id };
    }

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getSavedEvents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedEvents",
      populate: { path: "category", select: "name icon" },
    });
    res.status(200).json({ success: true, events: user.savedEvents });
  } catch (error) {
    next(error);
  }
};

export const toggleSavedEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) throw new ApiError(404, "Event not found.");

    const user = await User.findById(req.user._id);
    const index = user.savedEvents.findIndex((id) => id.toString() === req.params.eventId);

    let saved;
    if (index > -1) {
      user.savedEvents.splice(index, 1);
      saved = false;
    } else {
      user.savedEvents.push(req.params.eventId);
      saved = true;
    }
    await user.save();

    res.status(200).json({ success: true, saved });
  } catch (error) {
    next(error);
  }
};

export const addRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.recentlyViewed = user.recentlyViewed.filter((id) => id.toString() !== req.params.eventId);
    user.recentlyViewed.unshift(req.params.eventId);
    user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const query = { role: "user" };
    if (search) {
      query.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 50);

    const [users, total] = await Promise.all([
      User.find(query).sort("-createdAt").skip((pageNum - 1) * limitNum).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookingHistory = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id })
      .populate("eventId", "title date images")
      .sort("-createdAt");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");
    if (user.role === "admin") throw new ApiError(400, "Cannot block an admin account.");

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");
    if (user.role === "admin") throw new ApiError(400, "Cannot delete an admin account.");

    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};
