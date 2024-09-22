const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  } catch (err) {
    logger.error('JWT verification failed:', err);
    return res.status(401).json({ error: 'Invalid token.' });
  }
  next();
};

module.exports = authMiddleware;