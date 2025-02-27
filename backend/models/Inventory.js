// const mongoose = require("mongoose");

// const inventorySchema = new mongoose.Schema(
//   {
//     productName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     SKU: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     warehouseLocation: {
//       type: String,
//       required: true,
//     },
//     reorderThreshold: {
//       type: Number,
//       default: 10,
//     },
//     supplierInfo: {
//       name: String,
//       contact: String,
//     },
//   },
//   { timestamps: true }
// );

// const Inventory = mongoose.model("Inventory", inventorySchema);
// module.exports = Inventory;

const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 5 }, // Alert when stock is ≤ 5
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
