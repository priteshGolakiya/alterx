const asyncHandler = require("express-async-handler");
const Product = require("../../../models/productModel");

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

const getActiveProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true });
  res.json(products);
});

const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const products = await Product.find({
    name: { $regex: query, $options: "i" },
    active: true,
  });
  res.json(products);
});

module.exports = { searchProducts, getActiveProducts, getProductById };
