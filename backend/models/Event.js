import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Event category is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    address: {
      type: String,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    organizer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
    },
    seats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: 1,
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String, trim: true }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.virtual("remainingSeats").get(function () {
  return Math.max(this.seats - this.bookedSeats, 0);
});

eventSchema.virtual("isSoldOut").get(function () {
  return this.bookedSeats >= this.seats;
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

eventSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 7);
  }
  next();
});

eventSchema.index({ title: "text", description: "text", city: "text" });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ city: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
