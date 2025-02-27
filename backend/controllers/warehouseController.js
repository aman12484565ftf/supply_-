const asyncHandler = require("express-async-handler");
const Warehouse = require("../models/warehouseModel");
const mongoose = require("mongoose");

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
  res.json(warehouses);
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

// 📌 Export functions
module.exports = { addWarehouse, getStockItems, updateStockQuantity };
