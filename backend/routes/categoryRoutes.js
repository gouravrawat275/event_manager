import express from "express";
import {
  getCategories, getCategoriesAdmin, createCategory, updateCategory, deleteCategory,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import logActivity from "../middleware/activityLogger.js";
import { createCategorySchema, updateCategorySchema } from "../validators/categoryValidators.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/admin", protect, authorize("admin"), getCategoriesAdmin);
router.post("/", protect, authorize("admin"), validate(createCategorySchema), logActivity("Created a category"), createCategory);
router.put("/:id", protect, authorize("admin"), validate(updateCategorySchema), logActivity("Updated a category"), updateCategory);
router.delete("/:id", protect, authorize("admin"), logActivity("Deleted a category"), deleteCategory);

export default router;
