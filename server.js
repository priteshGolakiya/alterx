// require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// const app = express();
// const connectDB = require("./db/connection.js");
// const adminAuthMiddleware = require("./middleware/adminAuthMiddleware.js");
// const cookieParser = require("cookie-parser");
// const redis = require("redis");
// const expressRedisCache = require("express-redis-cache");

// // Create Redis client
// const redisClient = redis.createClient({
//   host:
//     process.env.REDIS_HOST ||
//     "redis-14825.c16.us-east-1-2.ec2.cloud.redislabs.com",
//   port: process.env.REDIS_PORT || 14825,
// });

// redisClient.on("error", (error) => {
//   console.error("Redis error:", error);
// });

// // Create cache middleware
// const cache = expressRedisCache({
//   client: redisClient,
//   expire: 60 * 15, // Cache for 15 minutes
// });

// // ------------------COMMON IMPORTS------------------
// const commonRoutes = require("./routes/common/common.js");
// const commonProductRoutes = require("./routes/common/commonProductRoutes.js");

// // ------------------ADMIN IMPORTS------------------
// const adminRoutes = require("./routes/admin/admin.js");
// const productRoutes = require("./routes/admin/productRoutes.js");

// app.use(cookieParser());

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       callback(null, true);
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.use("/admin", adminAuthMiddleware);

// /*--------------------------- Admin Routes--------------------------- */
// app.use("/admin", adminRoutes);
// app.use("/admin/product", productRoutes);

// /*--------------------------- Common Routes--------------------------- */
// app.use("/", commonRoutes);
// app.use("/product", cache.route(), commonProductRoutes);

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
const redis = require("redis");
const { promisify } = require("util");
const expressRedisCache = require("express-redis-cache");

// Create Redis client
const redisClient = redis.createClient({
  host:
    process.env.REDIS_HOST ||
    "redis-14825.c16.us-east-1-2.ec2.cloud.redislabs.com",
  port: process.env.REDIS_PORT || 14825,
  password: process.env.REDIS_PASSWORD, // Ensure the password is set if needed
  tls: {}, // Optional: Enable TLS if required by your Redis setup
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Promisify Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Create cache middleware
const cache = expressRedisCache({
  client: redisClient,
  expire: 60 * 15, // Cache for 15 minutes
});

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
