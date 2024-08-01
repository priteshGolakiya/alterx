const asyncHandler = require("express-async-handler");
const Product = require("../../../models/productModel");

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
});

const getActiveProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.json(products);
  } catch (error) {
    console.error("Error in getActiveProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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

module.exports = { searchProducts, getActiveProducts, getProductById };
