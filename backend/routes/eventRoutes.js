import express from "express";
import {
  getEvents, getFeaturedEvents, getUpcomingEvents, getPopularEvents,
  getEventById, getRelatedEvents, createEvent, updateEvent, deleteEvent,
  updateEventStatus, removeEventImage,
} from "../controllers/eventController.js";
import { protect, authorize } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import logActivity from "../middleware/activityLogger.js";
import { upload } from "../services/cloudinaryUpload.js";
import { createEventSchema, updateEventSchema } from "../validators/eventValidators.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/featured", getFeaturedEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/popular", getPopularEvents);
router.get("/:id", getEventById);
router.get("/:id/related", getRelatedEvents);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 6),
  validate(createEventSchema),
  logActivity("Created an event"),
  createEvent
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 6),
  validate(updateEventSchema),
  logActivity("Updated an event"),
  updateEvent
);
router.put("/:id/images/remove", protect, authorize("admin"), removeEventImage);
router.patch("/:id/status", protect, authorize("admin"), logActivity("Changed event status"), updateEventStatus);
router.delete("/:id", protect, authorize("admin"), logActivity("Deleted an event"), deleteEvent);

export default router;
