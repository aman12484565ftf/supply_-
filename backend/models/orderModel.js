const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
    trackingId: {
      type: String,
      unique: true,
      required: true, // Ensuring tracking ID is mandatory
    },
    estimatedDelivery: {
      type: Date,
    },
    paymentMode: {
      type: String,
      enum: ["Online", "COD"],
      // required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      default: "Unpaid",
    },
    paymentId: {
      type: String, // Stores online payment transaction ID
    },
    refund: {
      status: { type: String, enum: ["Pending", "Processed", "Failed"], default: "Pending" },
      refundId: { type: String }, // Stores refund transaction ID
      refundAmount: { type: Number },
      refundDate: { type: Date },
    },
    cancellationReason: {
      type: String, // Stores why an order was canceled
    },
    deliveryConfirmation: {
      type: String, // Store OTP or signature
      required: false,
    },
    qrCode: {
      type: String, // Store the QR code URL as a string
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
