import express from "express";
import {
  createBooking, getMyBookings, getBookingById, cancelBooking,
  getAllBookings, updateBookingStatus, exportBookingsCSV,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import logActivity from "../middleware/activityLogger.js";
import { createBookingSchema, cancelBookingSchema } from "../validators/bookingValidators.js";

const router = express.Router();

router.use(protect);

router.post("/", validate(createBookingSchema), createBooking);
router.get("/my", getMyBookings);

router.get("/", authorize("admin"), getAllBookings);
router.get("/export/csv", authorize("admin"), exportBookingsCSV);
router.put("/:id/status", authorize("admin"), logActivity("Updated booking status"), updateBookingStatus);

router.get("/:id", getBookingById);
router.put("/:id/cancel", validate(cancelBookingSchema), cancelBooking);

export default router;
