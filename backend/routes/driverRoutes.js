const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getDriverDeliveries, updateDeliveryStatus } = require("../controllers/driverController");

const router = express.Router();

router.get("/deliveries", protect, authorize("driver"), getDriverDeliveries);
router.put("/deliveries/:deliveryId", protect, authorize("driver"), updateDeliveryStatus);

module.exports = router;
