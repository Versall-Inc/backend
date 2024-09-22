const userService = require('../services/userService');
const logger = require('../utils/logger');
const userSchema = require('../schemas/userSchema');
const { get } = require('../routes/authRoutes');

// Create a new user
exports.createUser = async (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return next({ statusCode: 400, message: error.details[0].message });
  }

  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ user: newUser });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      let message = 'A user with this ';
      if (field === 'phoneNumber') {
        message += 'phone number';
      } else if (field === 'email') {
        message += 'email';
      } else if (field === 'username') {
        message += 'username';
      }
      message += ' already exists';
      return next({ statusCode: 400, message });
    }
    next(error);
  }
};


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
      return next({ statusCode: 404, message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};
exports.getUserByUserName = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return next({ statusCode: 404, message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};
exports.getUserByEmail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return next({ statusCode: 404, message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};
exports.getUserByPhoneNumber = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return next({ statusCode: 404, message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};
// Update user
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { error } = userSchema.validate(req.body);
  if (error) {
    return next({ statusCode: 400, message: error.details[0].message });
  }
  // Check if the request body contains the password field
  if (req.body.password) {
    return next({ statusCode: 400, message: 'Password update is not allowed' });
  }

  try {
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own user data' });
    }

    const updatedUser = await userService.updateUser(id, req.body);
    if (!updatedUser[0]) {
      return next({ statusCode: 404, message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      let message = 'A user with this ';
      if (field === 'phoneNumber') {
        message += 'phone number';
      } else if (field === 'email') {
        message += 'email';
      } else if (field === 'username') {
        message += 'username';
      }
      message += ' already exists';
      return next({ statusCode: 400, message });
    }
    next(error); // Pass the error to the error handler middleware
  }
};


exports.changePassword = async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  // Validate the new password
  if (!newPassword || newPassword.length < 6) {
    return next({ statusCode: 400, message: 'Password must be at least 6 characters long' });
  }

  try {
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own user data' });
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return next({ statusCode: 404, message: 'User not found' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return next({ statusCode: 404, message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};