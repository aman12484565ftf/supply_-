const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const User = require("../models/User");

// 📌 Fetch Customer Orders
const getCustomerOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ customer: req.user._id }).sort("-createdAt");
  
    if (!orders || !Array.isArray(orders)) {
      return res.status(200).json([]); // ✅ Return an empty array if no orders exist
    }
  
    res.status(200).json(orders);
  });
  

// 📌 Fetch Order Tracking Details
const getTrackingDetails = asyncHandler(async (req, res) => {
  const { trackingId } = req.params;
  
  const order = await Order.findOne({ trackingId }).select("orderStatus trackingId _id qrCode");

  if (!order) {
    res.status(404);
    throw new Error("Tracking details not found.");
  }

  res.json(order);
});

// 📌 Update Customer Profile
const updateCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.user._id);

  if (!customer) {
    res.status(404);
    throw new Error("User not found.");
  }

  customer.name = req.body.name || customer.name;
  customer.email = req.body.email || customer.email;

  const updatedCustomer = await customer.save();
  res.json({
    _id: updatedCustomer._id,
    name: updatedCustomer.name,
    email: updatedCustomer.email,
  });
});

module.exports = { getCustomerOrders, getTrackingDetails, updateCustomerProfile };
