const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ["Electronics", "Clothing", "Home", "Grocery", "Other"] },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 }, // Quantity available
    status: { type: String, enum: ["Available", "Out of Stock"], default: "Available" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Only admin can add
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
