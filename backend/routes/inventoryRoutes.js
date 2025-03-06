const express = require("express");
const { getInventory, updateProduct,addProduct } = require("../controllers/inventoryController"); // Ensure correct import
const { protect, authorize } = require("../middleware/authMiddleware");
const { deleteProduct } = require("../controllers/inventoryController");

const router = express.Router();

// 📌 Get all inventory items
router.get("/", protect, authorize("admin", "warehouse_manager"), getInventory);
router.post("/", protect, authorize("admin", "warehouse_manager"), addProduct);

// 📌 Update product in inventory
router.put("/:id", protect, authorize("admin", "warehouse_manager"), updateProduct);

router.delete("/:id", protect, authorize("admin", "warehouse_manager"), deleteProduct);

module.exports = router;
