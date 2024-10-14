"use strict";

var Joi = require('joi');

var userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').required(),
  firstName: Joi.string().min(1).max(50).required(),
  middleName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).required(),
  address: Joi.string().min(1).max(100).required(),
  phoneNumber: Joi.string().min(10).max(15).required(),
  accountStatus: Joi.string().valid('active', 'inactive').required()
});
module.exports = userSchema;