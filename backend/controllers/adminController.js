const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const User = require("../models/User");
const Product = require("../models/productModel");

const getDashboardStats = asyncHandler(async (req, res) => {
    try {
      // Fetch Total Orders Count
      const totalOrders = await Order.countDocuments() || 0;
  
      // Fetch Total Revenue
      const revenueResult = await Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
      ]);
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
  
      // Fetch Total Users Count
      const totalUsers = await User.countDocuments() || 0;
  
      // Fetch Total Stock
      const stockResult = await Product.aggregate([
        { $group: { _id: null, totalStock: { $sum: "$stock" } } }
      ]);
      const totalStock = stockResult.length > 0 ? stockResult[0].totalStock : 0;
  
      // 📊 Logging for debugging
      console.log("📊 Admin Dashboard Stats:");
      console.log("✅ Total Orders:", totalOrders);
      console.log("✅ Total Revenue:", totalRevenue);
      console.log("✅ Total Users:", totalUsers);
      console.log("✅ Total Stock:", totalStock);
  
      // Send JSON response
      res.json({
        orders: totalOrders,
        revenue: totalRevenue,
        users: totalUsers,
        stock: totalStock,
      });
  
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
  });
``  

// 📌 Fetch All Orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("customer", "name email").populate("items.product", "name price");
  res.json(orders);
});

// 📌 Fetch All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});
const getRevenueAnalytics = asyncHandler(async (req, res) => {
  try {
    // Aggregate total revenue per month
    const revenueByMonth = await Order.aggregate([
      {
        $match: { orderStatus: "Delivered" } // Only count completed orders
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } } // Sort by month
    ]);

    // Convert MongoDB aggregation output into a readable format
    const formattedData = Array.from({ length: 12 }, (_, index) => {
      const monthData = revenueByMonth.find((data) => data._id === index + 1);
      return {
        month: new Date(2024, index, 1).toLocaleString("en-US", { month: "short" }), // Convert index to month name
        revenue: monthData ? monthData.totalRevenue : 0
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error("❌ Error fetching revenue analytics:", error);
    res.status(500).json({ message: "Error fetching revenue analytics" });
  }
});

module.exports = { getDashboardStats, getAllOrders, getAllUsers ,getRevenueAnalytics };
