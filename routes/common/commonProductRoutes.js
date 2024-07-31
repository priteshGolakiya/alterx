const express = require("express");
const router = express.Router();
const expressRedisCache = require("express-redis-cache");
const cache = expressRedisCache({ expire: 60 * 15 }); 

const {
  searchProducts,
  getActiveProducts,
  getProductById,
} = require("../../controller/common/prodect/prodectController");

router.get("/:id", cache.route(), getProductById);
router.get("/", cache.route(), getActiveProducts);
router.get("/search", cache.route(), searchProducts);

module.exports = router;