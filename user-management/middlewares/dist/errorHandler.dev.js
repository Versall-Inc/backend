"use strict";

var logger = require('../utils/logger');

var errorHandler = function errorHandler(err, req, res, next) {
  logger.error(err.stack); // Log the error stack for debugging

  var statusCode = err.statusCode || 500;
  var message = err.message || 'Internal server error';
  res.status(statusCode).json({
    error: message
  });
};

module.exports = errorHandler;