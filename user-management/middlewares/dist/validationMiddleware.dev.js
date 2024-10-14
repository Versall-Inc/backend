"use strict";

var userSchema = require('../schemas/userSchema');

var validateUser = function validateUser(req, res, next) {
  var _userSchema$validate = userSchema.validate(req.body),
      error = _userSchema$validate.error;

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
};

module.exports = validateUser;