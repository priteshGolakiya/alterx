const asyncHandler = require("express-async-handler");
const Product = require("../../../models/productModel");

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, images } = req.body;
  const product = await Product.create({ name, images });
  res.status(201).json(product);
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, images, active } = req.body;
  const product = await Product.findByIdAndUpdate(
    id,
    { name, images, active },
    { new: true }
  );
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product deleted successfully" });
});

// Get all products (including inactive)
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
