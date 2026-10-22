import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    icon: {
      type: String,
      default: "Calendar",
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().trim().replace(/\s+/g, "-");
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
