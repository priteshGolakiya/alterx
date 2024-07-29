const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  let headerToken = null;

  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === "bearer") {
      headerToken = tokenParts[1];
    }
  }

  const token = req.cookies.token || headerToken;

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized: Token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      res.status(403);
      throw new Error("Forbidden: Admin access required");
    }

    req.userData = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = adminAuthMiddleware;
