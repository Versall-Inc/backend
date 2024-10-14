"use strict";

var userService = require('../services/userService');

var logger = require('../utils/logger');

var userSchema = require('../schemas/userSchema');

var _require = require('../routes/authRoutes'),
    get = _require.get; // Create a new user


exports.createUser = function _callee(req, res, next) {
  var _userSchema$validate, error, newUser, field, message;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _userSchema$validate = userSchema.validate(req.body), error = _userSchema$validate.error;

          if (!error) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next({
            statusCode: 400,
            message: error.details[0].message
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(userService.createUser(req.body));

        case 6:
          newUser = _context.sent;
          res.status(201).json({
            user: newUser
          });
          _context.next = 19;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);

          if (!(_context.t0.name === 'SequelizeUniqueConstraintError')) {
            _context.next = 18;
            break;
          }

          field = _context.t0.errors[0].path;
          message = 'A user with this ';

          if (field === 'phoneNumber') {
            message += 'phone number';
          } else if (field === 'email') {
            message += 'email';
          } else if (field === 'username') {
            message += 'username';
          }

          message += ' already exists';
          return _context.abrupt("return", next({
            statusCode: 400,
            message: message
          }));

        case 18:
          next(_context.t0);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
};

exports.getAllUsers = function _callee2(req, res, next) {
  var users;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(userService.getAllUsers());

        case 3:
          users = _context2.sent;
          res.status(200).json({
            users: users
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get user by ID


exports.getUserById = function _callee3(req, res, next) {
  var id, user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(userService.getUserById(id));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", next({
            statusCode: 404,
            message: 'User not found'
          }));

        case 7:
          res.status(200).json({
            user: user
          });
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          next(_context3.t0); // Pass the error to the error handler middleware

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // Update user


exports.updateUser = function _callee4(req, res, next) {
  var id, _userSchema$validate2, error, updatedUser, field, message;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _userSchema$validate2 = userSchema.validate(req.body), error = _userSchema$validate2.error;

          if (!error) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", next({
            statusCode: 400,
            message: error.details[0].message
          }));

        case 4:
          if (!req.body.password) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", next({
            statusCode: 400,
            message: 'Password update is not allowed'
          }));

        case 6:
          _context4.prev = 6;

          if (!(req.user.id !== id)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(403).json({
            error: 'Unauthorized: You can only update your own user data'
          }));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(userService.updateUser(id, req.body));

        case 11:
          updatedUser = _context4.sent;

          if (updatedUser[0]) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", next({
            statusCode: 404,
            message: 'User not found'
          }));

        case 14:
          res.status(200).json({
            message: 'User updated successfully'
          });
          _context4.next = 26;
          break;

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](6);

          if (!(_context4.t0.name === 'SequelizeUniqueConstraintError')) {
            _context4.next = 25;
            break;
          }

          field = _context4.t0.errors[0].path;
          message = 'A user with this ';

          if (field === 'phoneNumber') {
            message += 'phone number';
          } else if (field === 'email') {
            message += 'email';
          } else if (field === 'username') {
            message += 'username';
          }

          message += ' already exists';
          return _context4.abrupt("return", next({
            statusCode: 400,
            message: message
          }));

        case 25:
          next(_context4.t0); // Pass the error to the error handler middleware

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 17]]);
};

exports.changePassword = function _callee5(req, res, next) {
  var id, newPassword, user, hashedPassword;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          newPassword = req.body.newPassword; // Validate the new password

          if (!(!newPassword || newPassword.length < 6)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", next({
            statusCode: 400,
            message: 'Password must be at least 6 characters long'
          }));

        case 4:
          _context5.prev = 4;

          if (!(req.user.id !== id)) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(403).json({
            error: 'Unauthorized: You can only update your own user data'
          }));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(userService.getUserById(id));

        case 9:
          user = _context5.sent;

          if (user) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", next({
            statusCode: 404,
            message: 'User not found'
          }));

        case 12:
          _context5.next = 14;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 14:
          hashedPassword = _context5.sent;
          user.password = hashedPassword;
          _context5.next = 18;
          return regeneratorRuntime.awrap(user.save());

        case 18:
          res.status(200).json({
            message: 'Password updated successfully'
          });
          _context5.next = 24;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](4);
          next(_context5.t0); // Pass the error to the error handler middleware

        case 24:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 21]]);
}; // Delete user


exports.deleteUser = function _callee6(req, res, next) {
  var id, deletedUser;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(userService.deleteUser(id));

        case 4:
          deletedUser = _context6.sent;

          if (deletedUser) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", next({
            statusCode: 404,
            message: 'User not found'
          }));

        case 7:
          res.status(200).json({
            message: 'User deleted successfully'
          });
          _context6.next = 13;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](1);
          next(_context6.t0); // Pass the error to the error handler middleware

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 10]]);
};