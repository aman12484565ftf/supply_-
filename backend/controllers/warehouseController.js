const asyncHandler = require("express-async-handler");
const Warehouse = require("../models/warehouseModel");
const mongoose = require("mongoose");
const Product = require("../models/productModel");  // ✅ Import Missing Models
const Order = require("../models/orderModel"); 

// 📌 Add new warehouse (with stock items)
const addWarehouse = asyncHandler(async (req, res) => {
  try {
    const { name, location, capacity, stock = [] } = req.body;

    // Convert product IDs to ObjectId
    const formattedStock = stock.map((item) => ({
      product: new mongoose.Types.ObjectId(item.product), // Ensure ObjectId
      quantity: item.quantity,
    }));

    const warehouse = new Warehouse({
      name,
      location,
      capacity,
      stock: formattedStock, // Store converted stock array
    });

    const savedWarehouse = await warehouse.save();
    res.status(201).json(savedWarehouse);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// 📌 Get all warehouses with populated stock details
const getStockItems = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find().populate("stock.product", "name price category");
  console.log("📦 Warehouse Data Sent:", warehouses); // Debug log
  res.json(warehouses);
});

const getWarehouses = asyncHandler(async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);  // ✅ Ensure this is an array
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch warehouses" });
  }
});

// 📌 Update stock quantity in a warehouse
const updateStockQuantity = asyncHandler(async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found." });
    }

    // Find the product in the stock array
    const stockItem = warehouse.stock.find(
      (item) => item.product.toString() === productId
    );

    if (!stockItem) {
      return res.status(404).json({ message: "Product not found in warehouse stock." });
    }

    // Update stock quantity
    stockItem.quantity = quantity;
    const updatedWarehouse = await warehouse.save();
    
    res.json(updatedWarehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getWarehouseStats = asyncHandler(async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();  

    // ✅ Check if `stock` exists in `Product` or `Warehouse`
    const lowStock = await Warehouse.aggregate([
      { $unwind: "$stock" },
      { $match: { "stock.quantity": { $lt: 10 } } },
      { $count: "lowStockCount" }
    ]);

    // ✅ Fix pending shipments query
    const pendingShipments = await Order.countDocuments({ status: { $regex: /pending/i } });

    res.status(200).json({
      totalProducts,
      lowStock: lowStock.length > 0 ? lowStock[0].lowStockCount : 0,
      pendingShipments
    });
  } catch (error) {
    console.error("🚨 Warehouse Stats Error:", error.message);
    res.status(500).json({ message: "Failed to fetch warehouse stats" });
  }
});


// 📌 Export functions
module.exports = {getWarehouseStats,getWarehouses, addWarehouse, getStockItems, updateStockQuantity };
