const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Example admin-only route
router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You have full access." });
});

module.exports = router;
