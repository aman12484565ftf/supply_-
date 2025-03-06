const express = require("express");
const { getDashboardStats, getAllOrders, getAllUsers, getRevenueAnalytics } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Dashboard Overview
router.get("/dashboard", protect, authorize("admin"), getDashboardStats);

// Fetch All Orders
router.get("/orders", protect, authorize("admin"), getAllOrders);

// Fetch All Users
router.get("/users", protect, authorize("admin"), getAllUsers);

router.get("/revenue-analytics", protect, authorize("admin"), getRevenueAnalytics);

module.exports = router;
