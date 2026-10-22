import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";
import { generateQRCode } from "../utils/generateQRCode.js";
import sendEmail from "../utils/sendEmail.js";

export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { eventId, ticketCount, attendeeName, attendeeEmail, attendeePhone } = req.body;

    const event = await Event.findById(eventId).session(session);
    if (!event) throw new ApiError(404, "Event not found.");
    if (event.status !== "published") throw new ApiError(400, "This event is not open for booking.");

    const remaining = event.seats - event.bookedSeats;
    if (remaining < ticketCount) {
      throw new ApiError(400, `Only ${remaining} seat(s) remaining for this event.`);
    }

    const totalAmount = event.price * ticketCount;

    const created = await Booking.create(
      [
        {
          userId: req.user._id,
          eventId: event._id,
          ticketCount,
          totalAmount,
          attendeeName,
          attendeeEmail,
          attendeePhone,
          bookingStatus: "pending",
          paymentStatus: totalAmount === 0 ? "paid" : "unpaid",
        },
      ],
      { session }
    );
    const newBooking = created[0];

    const qrPayload = {
      ticketId: newBooking.ticketId,
      eventId: event._id.toString(),
      eventTitle: event.title,
      userId: req.user._id.toString(),
      ticketCount,
    };
    newBooking.qrCode = await generateQRCode(qrPayload);
    await newBooking.save({ session });

    event.bookedSeats += ticketCount;
    await event.save({ session });

    await Notification.create(
      [
        {
          userId: req.user._id,
          title: "Booking Confirmed",
          message: `Your booking for "${event.title}" (${ticketCount} ticket${ticketCount > 1 ? "s" : ""}) has been received and is pending approval.`,
          type: "booking",
          relatedEvent: event._id,
          relatedBooking: newBooking._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    sendEmail({
      to: attendeeEmail,
      subject: `Booking Confirmed: ${event.title}`,
      html: `<p>Hi ${attendeeName},</p><p>Your booking for <strong>${event.title}</strong> is confirmed.</p><p>Tickets: ${ticketCount}<br/>Total: $${totalAmount}<br/>Date: ${new Date(event.date).toDateString()} at ${event.time}<br/>Venue: ${event.venue}, ${event.city}</p><p>Ticket ID: ${newBooking.ticketId}</p>`,
    }).catch((err) => console.error("Booking confirmation email failed:", err.message));

    const populated = await Booking.findById(newBooking._id).populate(
      "eventId",
      "title date time venue city images price"
    );

    res.status(201).json({ success: true, booking: populated });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user._id };
    if (status) query.bookingStatus = status;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 50);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("eventId", "title date time venue city images price status slug")
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "eventId",
      "title date time venue city images price organizer"
    );
    if (!booking) throw new ApiError(404, "Booking not found.");

    const isOwner = booking.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to view this booking.");
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found.");

    const isOwner = booking.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to cancel this booking.");
    }

    if (["cancelled", "rejected"].includes(booking.bookingStatus)) {
      throw new ApiError(400, "This booking is already cancelled.");
    }

    booking.bookingStatus = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancelReason = req.body.cancelReason || "Cancelled by user";
    await booking.save();

    await Event.findByIdAndUpdate(booking.eventId, { $inc: { bookedSeats: -booking.ticketCount } });

    res.status(200).json({ success: true, message: "Booking cancelled successfully.", booking });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 15 } = req.query;
    const query = {};
    if (status) query.bookingStatus = status;
    if (search) {
      query.$or = [
        { ticketId: new RegExp(search, "i") },
        { attendeeName: new RegExp(search, "i") },
        { attendeeEmail: new RegExp(search, "i") },
      ];
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 50);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("eventId", "title date")
        .populate("userId", "name email")
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus } = req.body;
    if (!["approved", "rejected", "completed"].includes(bookingStatus)) {
      throw new ApiError(400, "Invalid status. Use approved, rejected, or completed.");
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found.");

    if (bookingStatus === "rejected" && !["rejected", "cancelled"].includes(booking.bookingStatus)) {
      await Event.findByIdAndUpdate(booking.eventId, { $inc: { bookedSeats: -booking.ticketCount } });
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();

    await Notification.create({
      userId: booking.userId,
      title: `Booking ${bookingStatus}`,
      message: `Your booking ${booking.ticketId} has been ${bookingStatus}.`,
      type: "booking",
      relatedBooking: booking._id,
    });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

export const exportBookingsCSV = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("eventId", "title")
      .populate("userId", "name email")
      .sort("-createdAt");

    const header = ["Ticket ID", "Event", "User", "Email", "Tickets", "Amount", "Booking Status", "Payment Status", "Date"];

    const rows = bookings.map((b) => [
      b.ticketId,
      b.eventId?.title || "N/A",
      b.userId?.name || "N/A",
      b.userId?.email || "N/A",
      b.ticketCount,
      b.totalAmount,
      b.bookingStatus,
      b.paymentStatus,
      new Date(b.createdAt).toLocaleDateString(),
    ]);

    const escapeCsv = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=bookings.csv");
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
