// const asyncHandler = require("express-async-handler");
// const Product = require("../../../models/productModel");

// // Create a new product
// const createProduct = asyncHandler(async (req, res) => {
//   const { name, images } = req.body;
//   const product = await Product.create({ name, images });
//   res.status(201).json(product);
// });

// // Update a product
// const updateProduct = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { name, images, active } = req.body;
//   const product = await Product.findByIdAndUpdate(
//     id,
//     { name, images, active },
//     { new: true }
//   );
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   res.json(product);
// });

// // Delete a product
// const deleteProduct = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndDelete(id);
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   res.json({ message: "Product deleted successfully" });
// });

// // Get all products (including inactive)
// const getAllProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// });

// const getProductById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const product = await Product.findById(id);
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   res.json(product);
// });

// module.exports = {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };

const asyncHandler = require("express-async-handler");
const Product = require("../../../models/productModel");
const redis = require("redis");
const { promisify } = require("util");

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

// Promisify Redis commands
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, images } = req.body;
  const product = await Product.create({ name, images });

  // Invalidate cache
  await delAsync("all_products");

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

  // Invalidate cache
  await Promise.all([delAsync(`product_${id}`), delAsync("all_products")]);

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

  // Invalidate cache
  await Promise.all([delAsync(`product_${id}`), delAsync("all_products")]);

  res.json({ message: "Product deleted successfully" });
});

// Get all products (including inactive)
const getAllProducts = asyncHandler(async (req, res) => {
  // Try to get from cache first
  const cachedProducts = await getAsync("all_products");
  if (cachedProducts) {
    return res.json(JSON.parse(cachedProducts));
  }

  // If not in cache, get from database
  const products = await Product.find();

  // Set in cache
  await setAsync("all_products", JSON.stringify(products), "EX", 900); // 15 minutes

  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Try to get from cache first
  const cachedProduct = await getAsync(`product_${id}`);
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
  await setAsync(`product_${id}`, JSON.stringify(product), "EX", 900); // 15 minutes

  res.json(product);
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
