import express from "express";
import { getMyNotifications, markAsRead, markAllAsRead, sendNotification } from "../controllers/notificationController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.post("/broadcast", authorize("admin"), sendNotification);

export default router;
