import Notification from "../models/Notification.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort("-createdAt").limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) throw new ApiError(404, "Notification not found.");
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const { title, message, type = "admin", userId } = req.body;
    if (!title || !message) throw new ApiError(400, "Title and message are required.");

    if (userId) {
      await Notification.create({ userId, title, message, type });
    } else {
      const users = await User.find({ role: "user" }).select("_id");
      const docs = users.map((u) => ({ userId: u._id, title, message, type }));
      await Notification.insertMany(docs);
    }

    res.status(201).json({ success: true, message: "Notification sent." });
  } catch (error) {
    next(error);
  }
};
