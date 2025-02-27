const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  addStockItem,
  getStockItems,
  updateStockQuantity,
  addWarehouse,
} = require("../controllers/warehouseController");

const router = express.Router();

// 📌 Add stock item (Restricted to warehouse managers & admins)
router.post("/", protect, authorize("warehouseManager", "admin"), addWarehouse);

// 📌 Get all stock items (More roles can access if needed)
router.get("/", protect, authorize("warehouseManager", "admin", "staff"), getStockItems);

// 📌 Update stock quantity (Restricted to warehouse managers & admins)
router.put("/:id", protect, authorize("warehouseManager", "admin"), updateStockQuantity);

// Catch-all for undefined routes (Optional)
router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
