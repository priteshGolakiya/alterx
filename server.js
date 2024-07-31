require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./db/connection.js");
const adminAuthMiddleware = require("./middleware/adminAuthMiddleware.js");
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
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// Create a custom cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    console.log(req.originalUrl || req.url);
    const key = "__express__" + (req.originalUrl || req.url);
    try {
      const cachedBody = await redisClient.get(key);
      if (cachedBody) {
        res.send(JSON.parse(cachedBody));
        return;
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          redisClient.setEx(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    } catch (error) {
      console.error("Redis cache error:", error);
      next();
    }
  };
};

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
app.use("/admin/product", productRoutes);

/*--------------------------- Common Routes--------------------------- */
app.use("/", commonRoutes);
app.use("/product", cache(60 * 15), commonProductRoutes); // Cache for 15 minutes

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
