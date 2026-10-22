import Event from "../models/Event.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import ActivityLog from "../models/ActivityLog.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalEvents, totalUsers, totalBookings, activeEvents, revenueAgg] = await Promise.all([
      Event.countDocuments(),
      User.countDocuments({ role: "user" }),
      Booking.countDocuments(),
      Event.countDocuments({ status: "published", date: { $gte: new Date() } }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        totalUsers,
        totalBookings,
        activeEvents,
        revenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyBookings = async (req, res, next) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const data = await Booking.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chartData = monthNames.map((name, idx) => {
      const match = data.find((d) => d._id.month === idx + 1);
      return { month: name, bookings: match?.count || 0, revenue: match?.revenue || 0 };
    });

    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    next(error);
  }
};

export const getCategoryDistribution = async (req, res, next) => {
  try {
    const data = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $project: { name: "$category.name", count: 1, _id: 0 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().populate("admin", "name email").sort("-createdAt").limit(100);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};
