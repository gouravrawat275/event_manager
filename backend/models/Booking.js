import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketCount: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    qrCode: {
      type: String,
      default: "",
    },
    ticketId: {
      type: String,
      unique: true,
    },
    attendeeName: String,
    attendeeEmail: String,
    attendeePhone: String,
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true }
);

bookingSchema.pre("validate", function (next) {
  if (!this.ticketId) {
    this.ticketId =
      "TKT-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

bookingSchema.index({ userId: 1 });
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ bookingStatus: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
