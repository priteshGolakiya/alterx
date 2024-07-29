const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

const allUserDetails = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    data: users,
    error: false,
    success: true,
    message: "User details",
  });
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userName, email, password, role, active } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "User not found" });
    }

    const updates = {};
    if (userName) updates.userName = userName;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (role) updates.role = role;
    if (active !== undefined) updates.active = active;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    res.status(200).json({
      error: false,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

const deleteUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    // Instead of deleting, set the user to inactive
    user.active = false;
    await user.save();

    res.status(200).json({
      error: false,
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error(`Error deactivating user: ${error.message}`);
    res.status(500).json({
      error: true,
      success: false,
      message: "Error deactivating user",
      error: error.message,
    });
  }
});

module.exports = { allUserDetails, updateUserDetails, deleteUserDetails };
