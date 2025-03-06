const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCustomerOrders,
  getTrackingDetails,
  updateCustomerProfile,
} = require("../controllers/customerController");

// ✅ Fetch Customer Orders
router.get("/orders", protect, getCustomerOrders);

// ✅ Fetch Tracking Details
router.get("/track/:trackingId", protect, getTrackingDetails);

// ✅ Update Customer Profile
router.put("/profile", protect, updateCustomerProfile);

module.exports = router;
