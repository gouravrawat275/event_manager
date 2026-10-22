import ActivityLog from "../models/ActivityLog.js";

const logActivity = (action) => (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode < 400 && req.user) {
      ActivityLog.create({
        admin: req.user._id,
        action,
        details: `${req.method} ${req.originalUrl}`,
        ipAddress: req.ip,
      }).catch((err) => console.error("Activity log failed:", err.message));
    }
  });
  next();
};

export default logActivity;
