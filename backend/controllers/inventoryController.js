const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// 🚀 Add New Product
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, stock, category } = req.body;
  
  const newProduct = await Product.create({
    name, price, stock, category,
  });

  res.status(201).json(newProduct);
});

// 🚀 Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// 🚀 Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.remove();
  res.json({ message: "Product removed successfully" });
});

module.exports = { addProduct, updateProduct, deleteProduct };
