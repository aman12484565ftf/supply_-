const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  updateShipmentStatus,
  cancelOrder,
  updateDeliveryStatus,
  confirmDelivery,
  getDriverOrders,
  assignDriver,
  createInvoice,
  getOrderByTrackingId
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/user", protect, getUserOrders);

router.put("/:id/cancel", protect, cancelOrder);
// Admins & Warehouse Managers can update order status (including cancellations)
router.put("/:id", protect, authorize("admin", "warehouseManager"), updateOrderStatus);
router.get("/invoice/:id", protect, createInvoice);
// Drivers can also update shipment status
router.put(
  "/shipment/update/:shipmentId",
  protect,
  authorize("admin", "warehouseManager", "driver"),
  updateShipmentStatus
);

router.put("/assign-driver", protect, authorize("admin"), assignDriver);

router.get("/driver/orders", protect, authorize("driver"), getDriverOrders);

router.put("/driver/update/:orderId", protect, authorize("driver"), updateDeliveryStatus);

router.post("/confirm-delivery", protect, confirmDelivery);

router.get("/track/:trackingId", getOrderByTrackingId);
router.get("/invoice/send/:orderId", createInvoice);
module.exports = router;
