const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
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
    return res.status(401).json({
      message: "Unauthorized: No token provided",
      success: false,
      error: true,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
        error: true,
      });
    }

    req.userId = decoded.id;
    next();
  });
};
module.exports = checkToken;
