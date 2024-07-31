require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./db/connection.js");
const adminAuthMiddleware = require("./middleware/adminAuthMiddleware.js");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const expressRedisCache = require("express-redis-cache");

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

// Create cache middleware
const cache = expressRedisCache({
  client: redisClient,
  expire: 60 * 15, // Cache for 15 minutes
});

const cookieParser = require("cookie-parser");

// ------------------COMMON IMPORTS------------------
const commonRoutes = require("./routes/common/common.js");
const commonProductRoutes = require("./routes/common/commonProductRoutes.js");

// ------------------ADMIN IMPORTS------------------
const adminRoutes = require("./routes/admin/admin.js");
const productRoutes = require("./routes/admin/productRoutes.js");

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/admin", adminAuthMiddleware);

/*--------------------------- Admin Routes--------------------------- */
app.use("/admin", adminRoutes);
app.use("/admin/product", productRoutes);

/*--------------------------- Common Routes--------------------------- */
app.use("/", commonRoutes);
app.use("/product", cache.route(), commonProductRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
