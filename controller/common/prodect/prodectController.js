const asyncHandler = require("express-async-handler");
const Product = require("../../../models/productModel");

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Try to get from cache first
    const cachedProduct = await req.redisClient.get(`product:${id}`);
    if (cachedProduct) {
      return res.json(JSON.parse(cachedProduct));
    }

    // If not in cache, get from database
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Set in cache
    await req.redisClient.setEx(`product:${id}`, 3600, JSON.stringify(product)); // Cache for 1 hour

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
    // Try to get from cache first
    const cachedProducts = await req.redisClient.get("activeProducts");
    if (cachedProducts) {
      return res.json(JSON.parse(cachedProducts));
    }

    // If not in cache, get from database
    const products = await Product.find({ active: true });

    // Set in cache
    await req.redisClient.setEx(
      "activeProducts",
      3600,
      JSON.stringify(products)
    ); // Cache for 1 hour

    res.json(products);
  } catch (error) {
    console.error("Error in getActiveProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  try {
    // Try to get from cache first
    const cachedResults = await req.redisClient.get(`search:${query}`);
    if (cachedResults) {
      return res.json(JSON.parse(cachedResults));
    }

    // If not in cache, search in database
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
      active: true,
    });

    // Set in cache
    await req.redisClient.setEx(
      `search:${query}`,
      1800,
      JSON.stringify(products)
    ); // Cache for 30 minutes

    res.json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { searchProducts, getActiveProducts, getProductById };
