const Product = require("../models/productModel");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, createdBy } = req.body;

    // Validate required fields
    if (!name || !description || !category || !price || !createdBy) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Create product
    const newProduct = new Product({
      name,
      description,
      category,
      price,
      stock: stock || 0, // Default to 0 if not provided
      createdBy, // Must be a valid ObjectId from the `User` collection
    });

    // Save to DB
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, getAllProducts };
