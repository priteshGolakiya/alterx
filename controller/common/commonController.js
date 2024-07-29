const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { clearCookie } = require("cookie-parser");
const User = require("../../models/userModel");

// login route
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    res.status(401).json({ error: "User not found!" });
    return;
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    res.status(401).json({ error: "Incorrect password!" });
    return;
  }

  const user = {
    id: foundUser._id,
    name: foundUser.userName,
    email: foundUser.email,
    role: foundUser.role,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  const tokenOption = {
    httpOnly: true,
  };

  res.cookie("token", token, tokenOption).status(200).json({
    message: "Login successful",
    data: { user, token },
    success: true,
    error: false,
  });
});

// Sign-up route
const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400).json({ status: true, message: "Missing fields" });
    return;
  }

  const foundUser = await User.findOne({ email });
  if (foundUser) {
    res.status(409).json({ error: "Email already in use." });
    return;
  }

  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  const user = {
    id: newUser._id,
    name: newUser.userName,
    role: newUser.role,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  res.status(201).json({
    error: false,
    success: true,
    message: "User created successfully!",
    data: { user, token },
  });
});

const userDetails = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const userData = {
      id: user._id,
      username: user.userName,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      data: userData,
      error: false,
      success: true,
      message: "User details retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
});

const logout = asyncHandler(async (req, res, next) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
});

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.userName = username;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUserData = {
      id: user._id,
      username: user.userName,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUserData,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

module.exports = { login, signup, userDetails, logout, updateUser };
