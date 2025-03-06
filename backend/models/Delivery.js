const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Assigned", "Out for Delivery", "Delivered"],
      default: "Assigned",
    },
    location: {
      type: String,
      default: "Warehouse",
    },
    deliveryOTP: {
      type: String, // OTP for customer confirmation
      required: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);
module.exports = Delivery;
