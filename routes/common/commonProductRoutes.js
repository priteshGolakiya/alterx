// const express = require("express");
// const router = express.Router();

// const {
//   searchProducts,
//   getActiveProducts,
//   getProductById,
// } = require("../../controller/common/prodect/prodectController");

// router.get("/:id", getProductById);
// router.get("/", getActiveProducts);
// router.get("/search", searchProducts);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  searchProducts,
  getActiveProducts,
  getProductById,
} = require("../../controller/common/prodect/prodectController");

router.get("/:id", getProductById);
router.get("/", getActiveProducts);
router.get("/search", searchProducts);

module.exports = router;
