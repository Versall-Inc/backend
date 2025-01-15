const userService = require("../services/userService");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return next({ statusCode: 404, message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  const id = req.user.id;

  try {
    const updatedUser = await userService.updateUser(id, req.body);
    if (!updatedUser) {
      return next({ statusCode: 404, message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      let message = "A user with this ";
      if (field === "phoneNumber") {
        message += "phone number";
      } else if (field === "email") {
        message += "email";
      } else if (field === "username") {
        message += "username";
      }
      message += " already exists";
      return next({ statusCode: 400, message });
    }
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const id = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await userService.getUserById(id, true);
    if (!user) {
      return next({ statusCode: 404, message: "User not found" });
    }

    console.log("hey");
    console.log(user);

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    console.log("hey1");
    if (!isPasswordValid) {
      return next({
        statusCode: 400,
        message: "Your current password is not correct",
      });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  const id = req.user.id;
  try {
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return next({ statusCode: 404, message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};
