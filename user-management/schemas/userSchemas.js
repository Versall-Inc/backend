const Joi = require("joi");

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 15 digits.",
    }),
});

const profileCompletionSchema = Joi.object({
  profilePicture: Joi.string().uri().optional(),
  firstname: Joi.string().min(3).max(100).required(),
  lastname: Joi.string().min(3).max(100).required(),
  timezone: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(100).required(),
  city: Joi.string().min(2).max(100).required(),
  accountStatus: Joi.string()
    .valid("active", "inactive")
    .optional()
    .default("active"),
  subscriptionStatus: Joi.string()
    .valid("subscribed", "unsubscribed")
    .optional()
    .default("unsubscribed"),
  refercode: Joi.string().optional(),
  referredBy: Joi.string().optional(),
  url_linkedin: Joi.string().uri().optional(),
  url_github: Joi.string().uri().optional(),
  url_website: Joi.string().uri().optional(),
});

const updateProfileSchema = Joi.object({
  profilePicture: Joi.string().uri().optional(),
  firstname: Joi.string().min(3).max(100).optional(),
  lastname: Joi.string().min(3).max(100).optional(),
  timezone: Joi.string().min(3).max(255).optional(),
  country: Joi.string().min(2).max(100).optional(),
  city: Joi.string().min(2).max(100).optional(),
  accountStatus: Joi.string().valid("active", "inactive").optional(),
  subscriptionStatus: Joi.string()
    .valid("subscribed", "unsubscribed")
    .optional(),
  bio: Joi.string().min(3).max(300).optional(),
  refercode: Joi.string().optional(),
  referredBy: Joi.string().optional(),
  url_linkedin: Joi.string().uri().optional(),
  url_github: Joi.string().uri().optional(),
  url_website: Joi.string().uri().optional(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
    }),
});

module.exports = {
  registrationSchema,
  profileCompletionSchema,
  updateProfileSchema,
  changePasswordSchema,
};
