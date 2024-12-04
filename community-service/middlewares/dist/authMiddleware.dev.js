"use strict";

module.exports = function (req, res, next) {
  var userId = req.headers['user-id'];

  if (!userId) {
    return res.status(401).json({
      message: 'Unauthorized: User ID missing'
    });
  }

  req.user = {
    id: userId
  };
  next();
};