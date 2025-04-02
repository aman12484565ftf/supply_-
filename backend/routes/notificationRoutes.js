const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

router.get("/", async (req, res) => {
  try {
    // Fetch recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.product", "name"); // Populate product names
    
    const orderNotifications = recentOrders.map((order) => ({
      message: `New order placed: ${order.items.map((item) => 
        `${item.product ? item.product.name : 'Unknown product'} x ${item.quantity}`).join(", ")}`,
      time: order.createdAt.toLocaleString(),
    }));
    
    // Fetch low-stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .sort({ updatedAt: -1 })
      .limit(5);
    
    const stockNotifications = lowStockProducts.map((product) => ({
      message: `Low stock alert: ${product.name} has only ${product.stock} units left!`,
      time: product.updatedAt.toLocaleString(),
    }));
    
    // Combine and sort notifications by time (latest first)
    const notifications = [...orderNotifications, ...stockNotifications].sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
    
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;