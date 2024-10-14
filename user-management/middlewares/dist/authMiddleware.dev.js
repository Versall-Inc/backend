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
          console.log(authHeader);
          token = authHeader.replace('Token ', '');
          _context.prev = 5;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context.next = 9;
          return regeneratorRuntime.awrap(User.findByPk(decoded.id));

        case 9:
          req.user = _context.sent;
          console.log(req.user);

          if (req.user) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            error: 'Invalid token.'
          }));

        case 13:
          if (!(req.params.id && req.params.id !== decoded.id)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", res.status(403).json({
            error: 'Access denied. You can only update your own account.'
          }));

        case 15:
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](5);
          logger.error('JWT verification failed:', _context.t0);
          return _context.abrupt("return", res.status(401).json({
            error: 'Invalid token.'
          }));

        case 21:
          next();

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 17]]);
};

module.exports = authMiddleware;