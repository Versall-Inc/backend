const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.string().min(6).optional(),
  firstName: Joi.string().min(1).max(50).required(),
  middleName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).required(),
  address: Joi.string().min(1).max(100).required(),
  phoneNumber: Joi.string().min(10).max(15).required(),
  accountStatus: Joi.string().valid('active', 'inactive').optional()
});

module.exports = userSchema;