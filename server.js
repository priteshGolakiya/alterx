// require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// const app = express();
// const connectDB = require("./db/connection.js");
// const adminAuthMiddleware = require("./middleware/adminAuthMiddleware.js");
// const cookieParser = require("cookie-parser");
// const { createClient } = require("redis");

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       callback(null, true);
//     },
//     credentials: true,
//   })
// );

// // Create Redis client
// const redisClient = createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     connectTimeout: 10000,
//     keepAlive: 5000,
//     reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
//   },
// });

// // Connect to Redis
// (async () => {
//   try {
//     await redisClient.connect();
//     console.log("Connected to Redis");
//   } catch (error) {
//     console.error("Failed to connect to Redis:", error);
//   }
// })();

// redisClient.on("error", (error) => {
//   console.error("Redis error:", error);
// });

// redisClient.on("end", () => {
//   console.log("Redis connection closed");
// });

// // Middleware to attach Redis client to req object
// app.use((req, res, next) => {
//   req.redisClient = redisClient;
//   next();
// });

// // Create a custom cache middleware
// const cache = (duration) => {
//   return async (req, res, next) => {
//     const key = "__express__" + (req.originalUrl || req.url);
//     console.log(`Cache middleware triggered for key: ${key}`);

//     try {
//       if (!redisClient.isOpen) {
//         console.warn("Redis client is not open, skipping cache");
//         return next();
//       }

//       const cachedBody = await redisClient.get(key);
//       if (cachedBody) {
//         console.log(`Cache hit for key: ${key}`);
//         return res.send(JSON.parse(cachedBody)); // Ensure immediate return
//       } else {
//         res.sendResponse = res.send; // Store original send method
//         res.send = (body) => {
//           redisClient.setEx(key, duration, JSON.stringify(body)); // Cache response
//           res.sendResponse(body); // Send response
//         };
//         console.log(`Cache miss for key: ${key}`);
//         next(); // Continue to route handler
//       }
//     } catch (error) {
//       console.error("Redis cache error:", error);
//       next();
//     }
//   };
// };

// // Graceful shutdown
// process.on("SIGINT", async () => {
//   await redisClient.quit();
//   process.exit(0);
// });

// // ------------------COMMON IMPORTS------------------
// const commonRoutes = require("./routes/common/common.js");
// const commonProductRoutes = require("./routes/common/commonProductRoutes.js");

// // ------------------ADMIN IMPORTS------------------
// const adminRoutes = require("./routes/admin/admin.js");
// const productRoutes = require("./routes/admin/productRoutes.js");

// app.use(cookieParser());
// app.use(express.json());

// app.use("/admin", adminAuthMiddleware);

// /*--------------------------- Admin Routes--------------------------- */
// app.use("/admin", adminRoutes);
// app.use("/admin/product", cache(60 * 15), productRoutes);

// /*--------------------------- Common Routes--------------------------- */
// app.use("/", commonRoutes);
// app.use("/product", cache(60 * 15), commonProductRoutes);

// // Server setup
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to connect to the database:", error);
//     process.exit(1);
//   }
// };

// startServer();

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

// Redis configuration
const REDIS_CONFIG = {
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  socket: {
    connectTimeout: 10000,
    keepAlive: 5000,
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
};

// Create Redis client
const redisClient = createClient(REDIS_CONFIG);

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

// Middleware to attach Redis client to req object
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_DURATION: 900, // 15 minutes
  PRODUCT_LIST_KEY: "product:list",
  ADMIN_PRODUCT_LIST_KEY: "admin:product:list",
  PRODUCT_KEY_PREFIX: "product:",
  ADMIN_PRODUCT_KEY_PREFIX: "admin:product:",
  SEARCH_KEY_PREFIX: "search:",
};

// Create a custom cache middleware
const cache = (keyPrefix, duration = CACHE_CONFIG.DEFAULT_DURATION) => {
  return async (req, res, next) => {
    const key = `${keyPrefix}${req.originalUrl || req.url}`;

    try {
      if (!redisClient.isOpen) {
        console.warn("Redis client is not open, skipping cache");
        return next();
      }

      const cachedBody = await redisClient.get(key);
      if (cachedBody) {
        return res.json(JSON.parse(cachedBody));
      } else {
        res.sendResponse = res.json;
        res.json = (body) => {
          redisClient
            .setEx(key, duration, JSON.stringify(body))
            .catch((error) => console.error("Redis cache set error:", error));
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
app.use(
  "/admin/product",
  cache(CACHE_CONFIG.ADMIN_PRODUCT_KEY_PREFIX),
  productRoutes
);

/*--------------------------- Common Routes--------------------------- */
app.use("/", commonRoutes);
app.use(
  "/product",
  cache(CACHE_CONFIG.PRODUCT_KEY_PREFIX),
  commonProductRoutes
);

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
