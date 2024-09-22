"use strict";

var jwt = require('jsonwebtoken');

var User = require('../models/user');

var logger = require('../utils/logger');

var authMiddleware = function authMiddleware(req, res, next) {
  var authHeader, token, decoded;
  return regeneratorRuntime.async(function authMiddleware$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          authHeader = req.header('Authorization');

          if (authHeader) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            error: 'Access denied. No token provided.'
          }));

        case 3:
          token = authHeader.replace('Bearer ', '');
          _context.prev = 4;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context.next = 8;
          return regeneratorRuntime.awrap(User.findByPk(decoded.id));

        case 8:
          req.user = _context.sent;

          if (req.user) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            error: 'Invalid token.'
          }));

        case 11:
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](4);
          logger.error('JWT verification failed:', _context.t0);
          return _context.abrupt("return", res.status(401).json({
            error: 'Invalid token.'
          }));

        case 17:
          next();

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 13]]);
};

module.exports = authMiddleware;