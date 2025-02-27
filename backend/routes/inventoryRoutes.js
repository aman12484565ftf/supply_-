const express = require("express");
const { addProduct, updateProduct, deleteProduct } = require("../controllers/inventoryController");

const router = express.Router();

router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
