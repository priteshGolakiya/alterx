require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./db/connection.js");
const adminAuthMiddleware = require("./middleware/adminAuthMiddleware.js");
const handleTokenErrors = require("./middleware/handleTokenErrors.js");
const cookieParser = require("cookie-parser");
const { createClient } = require("redis");

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

// Create Redis client
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  socket: {
    connectTimeout: 10000,
    keepAlive: 5000,
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
});
// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis in");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// Middleware to attach Redis client to req object
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

// Create a custom cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    const key = "express" + (req.originalUrl || req.url);
    console.log(`Checking cache for key: ${key}`);
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis client is not open, skipping cache");
        return next();
      }

      const cachedBody = await redisClient.get(key);
      console.log(`Cache result for ${key}:`, cachedBody ? "Hit" : "Miss");

      if (cachedBody) {
        console.log("Serving from cache");
        return res.send(JSON.parse(cachedBody));
      }

      console.log("Cache miss, proceeding to handler");
      res.originalSend = res.send;
      res.send = function (body) {
        console.log(`Caching response for ${key}`);
        redisClient.setEx(key, duration, JSON.stringify(body));
        res.originalSend(body);
      };

      next();
    } catch (error) {
      console.error("Redis cache error:", error);
      next();
    }
  };
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit(0);
});

// ------------------COMMON IMPORTS------------------
const commonRoutes = require("./routes/common/common.js");
const commonProductRoutes = require("./routes/common/commonProductRoutes.js");

// ------------------ADMIN IMPORTS------------------
const adminRoutes = require("./routes/admin/admin.js");
const productRoutes = require("./routes/admin/productRoutes.js");

app.use(cookieParser());
app.use(express.json());

app.use("/admin", adminAuthMiddleware);
/*--------------------------- Admin Routes--------------------------- */
app.use("/admin", adminRoutes);
app.use("/", handleTokenErrors);
app.use("/admin/product", productRoutes);

/*--------------------------- Common Routes--------------------------- */
app.use("/", commonRoutes);
app.use("/product", cache(900), commonProductRoutes); // Cache for 10 seconds

// Server setup
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
