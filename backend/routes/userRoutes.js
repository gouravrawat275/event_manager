import express from "express";
import {
  updateProfile, getSavedEvents, toggleSavedEvent, addRecentlyViewed,
  getUsers, getUserBookingHistory, toggleBlockUser, deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import logActivity from "../middleware/activityLogger.js";
import { upload } from "../services/cloudinaryUpload.js";
import { updateProfileSchema } from "../validators/userValidators.js";

const router = express.Router();

router.use(protect);

router.put("/profile", upload.single("avatar"), validate(updateProfileSchema), updateProfile);
router.get("/saved-events", getSavedEvents);
router.put("/saved-events/:eventId", toggleSavedEvent);
router.put("/recently-viewed/:eventId", addRecentlyViewed);

router.get("/", authorize("admin"), getUsers);
router.get("/:id/bookings", authorize("admin"), getUserBookingHistory);
router.put("/:id/block", authorize("admin"), logActivity("Toggled user block status"), toggleBlockUser);
router.delete("/:id", authorize("admin"), logActivity("Deleted a user"), deleteUser);

export default router;
