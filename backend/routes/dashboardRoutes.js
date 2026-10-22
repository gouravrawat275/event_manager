import express from "express";
import { getDashboardStats, getMonthlyBookings, getCategoryDistribution, getActivityLogs } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/monthly-bookings", getMonthlyBookings);
router.get("/category-distribution", getCategoryDistribution);
router.get("/activity-logs", getActivityLogs);

export default router;
