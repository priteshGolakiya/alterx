const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  userDetails,
  logout,
  updateUser,
  refreshToken,
} = require("../../controller/common/commonController.js");
const authToken = require("../../middleware/authToken.js");

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// Protected routes
router.get("/user-details", authToken, userDetails);
router.put("/update-user", authToken, updateUser);

// New route for token refresh
router.post("/refresh-token", authToken, refreshToken);

module.exports = router;
