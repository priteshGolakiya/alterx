const asyncHandler = require("express-async-handler");
const Product = require("../../../models/productModel");

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const getActiveProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true });
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id, active: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const products = await Product.find({
    name: { $regex: query, $options: "i" },
    active: true,
  });
  res.json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, images } = req.body;
  const product = await Product.create({ name, images, active: true });

  // Invalidate cache
  await invalidateCache(req.redisClient, [
    CACHE_CONFIG.PRODUCT_LIST_KEY,
    CACHE_CONFIG.ADMIN_PRODUCT_LIST_KEY,
  ]);

  res.status(201).json(product);
});

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

  // Invalidate cache
  await invalidateCache(req.redisClient, [
    `${CACHE_CONFIG.PRODUCT_KEY_PREFIX}${id}`,
    `${CACHE_CONFIG.ADMIN_PRODUCT_KEY_PREFIX}${id}`,
    CACHE_CONFIG.PRODUCT_LIST_KEY,
    CACHE_CONFIG.ADMIN_PRODUCT_LIST_KEY,
  ]);

  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Invalidate cache
  await invalidateCache(req.redisClient, [
    `${CACHE_CONFIG.PRODUCT_KEY_PREFIX}${id}`,
    `${CACHE_CONFIG.ADMIN_PRODUCT_KEY_PREFIX}${id}`,
    CACHE_CONFIG.PRODUCT_LIST_KEY,
    CACHE_CONFIG.ADMIN_PRODUCT_LIST_KEY,
  ]);

  res.json({ message: "Product deleted successfully" });
});

// Helper function to invalidate multiple cache keys
const invalidateCache = async (redisClient, keys) => {
  try {
    await Promise.all(keys.map((key) => redisClient.del(key)));
  } catch (error) {
    console.error("Error invalidating cache:", error);
  }
};

module.exports = {
  getAllProducts,
  getActiveProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
