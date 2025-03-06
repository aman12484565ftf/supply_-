const asyncHandler = require("express-async-handler");
const Delivery = require("../models/Delivery");
const Order = require("../models/orderModel");
const sendEmail = require("../utils/sendEmail");

// 📌 Fetch Deliveries Assigned to a Driver
const getDriverDeliveries = asyncHandler(async (req, res) => {
    const driverId = req.user._id;
  
    const deliveries = await Delivery.find({ driver: driverId })
      .populate("order", "trackingId shippingAddress orderStatus createdAt")
      .populate("driver", "name email");
  
    if (!deliveries.length) {
      return res.json({
        deliveries: [],
        totalDistance: 0,
        fuelConsumption: 0,
        onTimeRate: 0,
        deliveryPerformance: [],
        routeEfficiency: [],
      });
    }
  
    let totalDistance = 0;
    let fuelConsumption = 0;
    let onTimeDeliveries = 0;
    let deliveryStats = {};
  
    deliveries.forEach((delivery) => {
      totalDistance += delivery.distance || 0;
      fuelConsumption += delivery.fuelUsed || 0;
  
      // Track deliveries completed per day
      const date = new Date(delivery.createdAt).toLocaleDateString();
      if (!deliveryStats[date]) {
        deliveryStats[date] = { date, deliveries: 0 };
      }
      deliveryStats[date].deliveries += 1;
  
      if (delivery.status === "Delivered" && delivery.onTime) {
        onTimeDeliveries++;
      }
    });
  
    const totalDeliveries = deliveries.length;
    const onTimeRate = totalDeliveries ? ((onTimeDeliveries / totalDeliveries) * 100).toFixed(1) : 0;
  
    // Convert deliveryStats object to array
    const deliveryPerformance = Object.values(deliveryStats).sort((a, b) => new Date(a.date) - new Date(b.date));
  
    // Example Route Efficiency Data
    const routeEfficiency = [
      { month: "Jan", efficiency: (totalDistance / totalDeliveries).toFixed(1) || 0 },
      { month: "Feb", efficiency: (totalDistance / (totalDeliveries + 1)).toFixed(1) || 0 },
      { month: "Mar", efficiency: (totalDistance / (totalDeliveries + 2)).toFixed(1) || 0 },
    ];
  
    res.json({
      deliveries,
      totalDistance,
      fuelConsumption,
      onTimeRate,
      deliveryPerformance,
      routeEfficiency,
    });
  });

// 📌 Update Delivery Status (Out for Delivery or Delivered)
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { deliveryId } = req.params;
  const { status, location, otp } = req.body;

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    res.status(404);
    throw new Error("Delivery not found.");
  }

  if (status === "Delivered" && otp !== delivery.deliveryOTP) {
    res.status(400);
    throw new Error("Invalid OTP. Delivery cannot be confirmed.");
  }

  delivery.status = status;
  delivery.location = location;
  if (status === "Delivered") {
    delivery.deliveredAt = new Date();
  }

  await delivery.save();

  // Update the corresponding order status
  if (status === "Delivered") {
    const order = await Order.findById(delivery.order);
    order.orderStatus = "Delivered";
    await order.save();
  }

  res.json({ message: "Delivery status updated successfully", delivery });
});



module.exports = { getDriverDeliveries, updateDeliveryStatus };
