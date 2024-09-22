"use strict";

var userRepository = require('../repositories/userRepository');

var bcrypt = require('bcrypt');

var createUser = function createUser(userData) {
  var hashedPassword;
  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcrypt.hash(userData.password, 10));

        case 2:
          hashedPassword = _context.sent;
          userData.password = hashedPassword;
          _context.next = 6;
          return regeneratorRuntime.awrap(userRepository.createUser(userData));

        case 6:
          return _context.abrupt("return", _context.sent);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

var getAllUsers = function getAllUsers() {
  return regeneratorRuntime.async(function getAllUsers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(userRepository.getAllUsers());

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var getUserById = function getUserById(id) {
  return regeneratorRuntime.async(function getUserById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(userRepository.getUserById(id));

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var updateUser = function updateUser(id, userData) {
  return regeneratorRuntime.async(function updateUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(userRepository.updateUser(id, userData));

        case 2:
          return _context4.abrupt("return", _context4.sent);

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var deleteUser = function deleteUser(id) {
  return regeneratorRuntime.async(function deleteUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(userRepository.deleteUser(id));

        case 2:
          return _context5.abrupt("return", _context5.sent);

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var changePassword = function changePassword(id, newPassword) {
  var hashedPassword;
  return regeneratorRuntime.async(function changePassword$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 2:
          hashedPassword = _context6.sent;
          _context6.next = 5;
          return regeneratorRuntime.awrap(userRepository.updateUser(id, {
            password: hashedPassword
          }));

        case 5:
          return _context6.abrupt("return", _context6.sent);

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var getUserByEmail = function getUserByEmail(email) {
  return regeneratorRuntime.async(function getUserByEmail$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(userRepository.getUserByEmail(email));

        case 2:
          return _context7.abrupt("return", _context7.sent);

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports = {
  createUser: createUser,
  getAllUsers: getAllUsers,
  getUserById: getUserById,
  updateUser: updateUser,
  deleteUser: deleteUser,
  changePassword: changePassword,
  getUserByEmail: getUserByEmail
};