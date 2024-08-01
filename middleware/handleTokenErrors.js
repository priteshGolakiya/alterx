const handleTokenErrors = (err, req, res, next) => {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expired",
      error: true,
      success: false,
      errorCode: "TOKEN_EXPIRED",
    });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token",
      error: true,
      success: false,
      errorCode: "INVALID_TOKEN",
    });
  }
  next(err);
};

module.exports = handleTokenErrors;
