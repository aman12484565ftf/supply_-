const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { io } = require("../server"); // Import WebSocket instance
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const sendEmail = require("../utils/sendEmail");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const generateInvoice = require("../utils/generateInvoice");
// Order Status Constants
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// 📌 Create Order with Atomic Transactions
const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Order must include at least one product.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trackingId = uuidv4();

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) throw new Error(`Product not found: ${item.product}`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for: ${product.name}`);

      // Reduce stock and save
      product.stock -= item.quantity;
      await product.save({ session });

      // Send stock alert if low
      if (product.stock <= product.lowStockThreshold) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Stock Alert: Replenishment Needed",
          `The stock for ${product.name} is low (Remaining: ${product.stock}). Please restock it.`
        );
      }
    }

    // Create Order
    const order = new Order({
      customer: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      orderStatus: "Pending",
      trackingId,
    });

    const createdOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw new Error(error.message);
  }
});

const createInvoice = async (req, res) => {
  try {
    
    // ✅ Fetch order from DB and populate customer & product details
    // const { orderId} = req.body;
    console.log("Received full URL:", req.originalUrl); // ✅ Log full request URL
    console.log("Received request params:", req.params);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing orderId in URL" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    console.log("Received orderId:", req.body.id);
    const order = await Order.findById(id)
      .populate("customer", "name email") // Fetch customer details
      .populate("items.product", "name price"); // Fetch product details

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Ensure invoices directory exists
    const invoiceDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(invoiceDir, `invoice_${order._id}.pdf`);
    
    await generateInvoice(order, filePath);

    res.status(200).json({ message: "Invoice generated successfully", filePath });
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({
      message: "Error generating invoice",
      error: error.message || error,
    });
  }
};

// 📌 Get user orders
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort("-createdAt");
  res.json(orders);
});

// 📌 Update Order Status (Including Cancellation & Stock Restoration)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (!ORDER_STATUSES.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status.");
  }

  if (order.orderStatus === "Delivered") {
    res.status(400);
    throw new Error("Cannot update status of a delivered order.");
  }

  // If cancelling an order, restore stock
  if (status === "Cancelled" && order.orderStatus !== "Cancelled") {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id).session(session);
        if (product) {
          product.stock += item.quantity;
          await product.save({ session });
        }
      }

      order.orderStatus = "Cancelled";
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      io.emit("orderStatusUpdated", {
        orderId: order._id,
        status: "Cancelled",
        message: "Order has been cancelled, and stock has been restored.",
      });

      return res.json({ message: "Order cancelled successfully and stock restored." });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500);
      throw new Error("Error cancelling order. Try again.");
    }
  }

  // Normal status update
  order.orderStatus = status;
  const updatedOrder = await order.save();

  io.emit("orderStatusUpdated", {
    orderId: order._id,
    status: order.orderStatus,
  });

  res.json(updatedOrder);
});

// 📌 Update Shipment Status & Notify Clients
const updateShipmentStatus = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;
  const { status, location } = req.body;

  const order = await Order.findById(shipmentId);
  if (!order) {
    res.status(404);
    throw new Error("Shipment not found.");
  }

  order.orderStatus = status;
  order.location = location;
  await order.save();

  io.emit("shipmentUpdated", {
    shipmentId,
    status,
    location,
  });

  res.json({
    message: "Shipment updated successfully",
    shipmentId,
    status,
    location,
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("customer", "email name");

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.orderStatus !== "Pending" && order.orderStatus !== "Processing") {
    res.status(400);
    throw new Error("Order cannot be canceled at this stage.");
  }

  let refundMessage = "";
  let refundDetails = {};

  // Refund process for online payments
  if (order.paymentMode === "Online" && order.paymentStatus === "Paid") {
    try {
      const refundResponse = await processRefund(order.paymentId, order.totalAmount); // Simulated refund API call
      
      refundDetails = {
        status: "Processed",
        refundId: refundResponse.refundId,
        refundAmount: order.totalAmount,
        refundDate: new Date(),
      };

      order.paymentStatus = "Refunded";
      order.refund = refundDetails;
      refundMessage = `Your refund (₹${order.totalAmount}) has been successfully processed. Refund ID: ${refundResponse.refundId}.`;
    } catch (error) {
      refundDetails = { status: "Failed", refundAmount: order.totalAmount };
      order.refund = refundDetails;
      res.status(500);
      throw new Error("Failed to process refund. Please try again.");
    }
  }

  // Update order status
  order.orderStatus = "Canceled";
  await order.save();

  // 📩 **Send email to the customer**
  await sendEmail(
    order.customer.email,
    "Your Order Has Been Canceled",
    `
      Hi ${order.customer.name},

      Your order with Tracking ID: ${order.trackingId} has been successfully canceled.
      ${refundMessage ? refundMessage : "Since this was a cash-on-delivery order, no refund is required."}

      If you have any questions, feel free to contact our support.

      Regards,  
      Your Company Name
    `
  );

  // 📩 **Send email to the admin**
  await sendEmail(
    process.env.ADMIN_EMAIL,
    "Order Cancellation Alert",
    `
      Alert! An order has been canceled.

      Order ID: ${order._id}  
      Customer: ${order.customer.name} (${order.customer.email})  
      Total Amount: ₹${order.totalAmount}  
      Payment Mode: ${order.paymentMode}  
      Refund Status: ${refundDetails.status || "N/A"}  

      Please review the cancellation and update inventory if needed.
    `
  );

  // 🔄 **Emit WebSocket event**
  io.emit("orderCancelled", {
    orderId: order._id,
    status: "Canceled",
    refundStatus: refundDetails.status || "N/A",
  });

  res.json({ message: "Order canceled successfully. Notifications sent.", order });
});

// 📌 Assign a driver to an order (Admin Only)
const assignDriver = asyncHandler(async (req, res) => {
  const { orderId, driverId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  const driver = await User.findById(driverId);
  if (!driver || driver.role !== "driver") {
    res.status(400);
    throw new Error("Invalid driver.");
  }

  order.assignedDriver = driverId;
  order.orderStatus = "Shipped"; // Move order to "Shipped" status
  await order.save();

  // Notify the driver in real-time
  io.emit("driverAssigned", { orderId, driverId });

  res.json({ message: "Driver assigned successfully", order });
});

// 📌 Get Orders Assigned to a Driver
const getDriverOrders = asyncHandler(async (req, res) => {
  const driverId = req.user._id;

  const orders = await Order.find({ assignedDriver: driverId }).sort("-createdAt");

  res.json(orders);
});

// 📌 Driver Updates Order Status (Out for Delivery / Delivered)
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, confirmation } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.assignedDriver.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Unauthorized: You are not assigned to this order.");
  }

  if (status === "Delivered" && !confirmation) {
    res.status(400);
    throw new Error("Delivery confirmation (OTP/signature) is required.");
  }

  order.orderStatus = status;
  if (confirmation) order.deliveryConfirmation = confirmation;

  await order.save();

  // Notify customer when order is out for delivery or delivered
  io.emit("deliveryUpdate", { orderId, status });

  res.json({ message: "Order status updated", order });
});


// 📌 Customer Confirms Delivery with OTP
const confirmDelivery = asyncHandler(async (req, res) => {
  const { orderId, otp } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.deliveryConfirmation !== otp) {
    res.status(400);
    throw new Error("Invalid OTP.");
  }

  order.orderStatus = "Delivered";
  await order.save();

  io.emit("orderDelivered", { orderId });

  res.json({ message: "Delivery confirmed successfully", order });
});


// const createInvoice = async (req, res) => {
//   try {
    
//     // ✅ Fetch order from DB and populate customer & product details
//     const { orderId} = req.body;
//     console.log("Received orderId:", req.body.orderId);
//     const order = await Order.findById(orderId)
//       .populate("customer", "name email") // Fetch customer details
//       .populate("items.product", "name price"); // Fetch product details

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // ✅ Ensure invoices directory exists
//     const invoiceDir = path.join(__dirname, "../invoices");
//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir, { recursive: true });
//     }

//     const filePath = path.join(invoiceDir, `invoice_${order._id}.pdf`);
    
//     await generateInvoice(order, filePath);

//     res.status(200).json({ message: "Invoice generated successfully", filePath });
//   } catch (error) {
//     console.error("Invoice generation error:", error);
//     res.status(500).json({
//       message: "Error generating invoice",
//       error: error.message || error,
//     });
//   }
// };

module.exports = { createInvoice,createOrder,updateDeliveryStatus,confirmDelivery,getDriverOrders,assignDriver, getUserOrders, updateOrderStatus, updateShipmentStatus, cancelOrder };
