"use strict";

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var User = require('../models/user');

var logger = require('../utils/logger');

var userSchema = require('../schemas/userSchema');

exports.register = function _callee(req, res) {
  var _req$body, username, email, password, confirmPassword, firstName, middleName, lastName, address, phoneNumber, _userSchema$validate, error, hashedPassword, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, confirmPassword = _req$body.confirmPassword, firstName = _req$body.firstName, middleName = _req$body.middleName, lastName = _req$body.lastName, address = _req$body.address, phoneNumber = _req$body.phoneNumber;

          if (!(password === undefined || password === null)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Password required"
          }));

        case 3:
          if (!(confirmPassword === undefined || confirmPassword === null)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "confirmPassword required"
          }));

        case 5:
          _userSchema$validate = userSchema.validate(req.body), error = _userSchema$validate.error;

          if (!error) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: error.details[0].message
          }));

        case 8:
          if (!(password !== confirmPassword)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Passwords do not match"
          }));

        case 10:
          _context.prev = 10;
          _context.next = 13;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 13:
          hashedPassword = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(User.create({
            username: username,
            email: email,
            password: hashedPassword,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            address: address,
            phoneNumber: phoneNumber
          }));

        case 16:
          user = _context.sent;
          res.status(201).json(user);
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](10);
          logger.error('User registration failed:', _context.t0);
          res.status(500).json({
            error: 'Internal server error.'
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 20]]);
};

exports.login = function _callee2(req, res) {
  var _req$body2, email, password, user, isMatch, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Email and password are required.'
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            error: 'Invalid email or password.'
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 11:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            error: 'Invalid email or password.'
          }));

        case 14:
          token = jwt.sign({
            id: user.id
          }, process.env.JWT_SECRET, {
            expiresIn: '6h'
          });
          console.log(token);
          console.log(user.id);
          res.json({
            token: token
          });
          _context2.next = 24;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](3);
          logger.error('Login failed:', _context2.t0);
          res.status(500).json({
            error: 'Internal server error.'
          });

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 20]]);
};