const asyncHandler = require("express-async-handler");
const Product = require("../../../models/productModel");

// Get all active products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all active products (same as getAllProducts, can be removed if not needed)
const getActiveProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.json(products);
  } catch (error) {
    console.error("Error in getActiveProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single active product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id, active: true });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search products by name
const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
      active: true,
    });
    res.json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, images } = req.body;
  try {
    const product = await Product.create({ name, images, active: true });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an existing product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, images, active } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, images, active },
      { new: true }
    );
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  getAllProducts,
  getActiveProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
