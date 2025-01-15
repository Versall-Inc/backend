const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack); // Log the error stack for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;