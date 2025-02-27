const express = require("express");
const { createProduct, getAllProducts } = require("../controllers/productController");

const router = express.Router();

// Make sure all functions exist before using them
router.post("/", createProduct);
router.get("/", getAllProducts);

module.exports = router;
