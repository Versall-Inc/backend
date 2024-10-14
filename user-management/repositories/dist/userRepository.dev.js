"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var IUserRepository = require('./IRepository/IUserRepository.js');

var User = require('../models/user'); // Ensure this path is correct

/**
 * @implements {IUserRepository}
 */


var UserRepository =
/*#__PURE__*/
function (_IUserRepository) {
  _inherits(UserRepository, _IUserRepository);

  function UserRepository() {
    _classCallCheck(this, UserRepository);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserRepository).apply(this, arguments));
  }

  _createClass(UserRepository, [{
    key: "createUser",
    value: function createUser(userData) {
      return regeneratorRuntime.async(function createUser$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(User.create(userData));

            case 2:
              return _context.abrupt("return", _context.sent);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "getAllUsers",
    value: function getAllUsers() {
      return regeneratorRuntime.async(function getAllUsers$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(User.findAll({
                attributes: ["id", "username", "email", "firstName", "middleName", "lastName", "address", "phoneNumber", "accountStatus"]
              }));

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "getUserById",
    value: function getUserById(id) {
      return regeneratorRuntime.async(function getUserById$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(User.findByPk(id, {
                attributes: {
                  exclude: ['password']
                }
              }));

            case 2:
              return _context3.abrupt("return", _context3.sent);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "getUserByEmail",
    value: function getUserByEmail(email) {
      return regeneratorRuntime.async(function getUserByEmail$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(User.findOne({
                where: {
                  email: email
                },
                attributes: {
                  exclude: ['password']
                }
              }));

            case 2:
              return _context4.abrupt("return", _context4.sent);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "updateUser",
    value: function updateUser(id, userData) {
      return regeneratorRuntime.async(function updateUser$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(User.update(userData, {
                where: {
                  id: id
                }
              }));

            case 2:
              return _context5.abrupt("return", _context5.sent);

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(id) {
      return regeneratorRuntime.async(function deleteUser$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(User.destroy({
                where: {
                  id: id
                }
              }));

            case 2:
              return _context6.abrupt("return", _context6.sent);

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }]);

  return UserRepository;
}(IUserRepository);

module.exports = new UserRepository();