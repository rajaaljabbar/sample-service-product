const express = require("express");
const router = express.Router();
const UsecaseProducts = require("../flow/flow-products");
const { authenticateJWT } = require("../helper/authHelper");
require("dotenv").config();

// 🟢 Create Product
const createProduct = async (req, res) => {
  try {
    console.log("DEBUG: Incoming Product Data:", req.body);
    const { product_name, stock, price, expired_date } = req.body;

    if (!product_name || stock === undefined || !price || !expired_date) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    const newProduct = await UsecaseProducts.createProduct({
      product_name,
      stock,
      price,
      expired_date,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// 🔵 Get Products
const getProducts = async (req, res) => {
  try {
    console.log("DEBUG: User from Token:", req.user);
    const { product_id } = req.query;

    let products;
    if (product_id) {
      products = await UsecaseProducts.getProductById(product_id);
    } else {
      products = await UsecaseProducts.getAllProducts();
    }

    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// 🟢 Update Product
const updateProduct = async (req, res) => {
  try {
    console.log("DEBUG: Incoming Update Data:", req.body);
    const { product_id, product_name, stock, price, expired_date } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const updatedProduct = await UsecaseProducts.updateProduct({
      product_id,
      product_name,
      stock,
      price,
      expired_date,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// 🟢 Delete Product
const deleteProduct = async (req, res) => {
  try {
    console.log("DEBUG: Incoming Delete Request:", req.body);
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    await UsecaseProducts.deleteProduct(product_id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// 🔵 Define Routes
router.post("/products", authenticateJWT, createProduct);
router.get("/products", authenticateJWT, getProducts);
router.put("/products", authenticateJWT, updateProduct);
router.delete("/products", authenticateJWT, deleteProduct);

module.exports = router;
