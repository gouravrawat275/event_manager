import Category from "../models/Category.js";
import Event from "../models/Event.js";
import ApiError from "../utils/ApiError.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort("name");
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const eventCount = await Event.countDocuments({ category: cat._id });
        return { ...cat.toObject(), eventCount };
      })
    );
    res.status(200).json({ success: true, categories: withCounts });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const existing = await Category.findOne({ name: new RegExp(`^${req.body.name}$`, "i") });
    if (existing) throw new ApiError(409, "A category with this name already exists.");

    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) throw new ApiError(404, "Category not found.");
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const eventCount = await Event.countDocuments({ category: req.params.id });
    if (eventCount > 0) {
      throw new ApiError(400, `Cannot delete: ${eventCount} event(s) use this category.`);
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new ApiError(404, "Category not found.");
    res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
};
