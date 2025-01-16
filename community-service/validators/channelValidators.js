const Joi = require("joi");

exports.createChannelSchema = Joi.object({
  name: Joi.string().max(100).required(),
  isPublic: Joi.boolean().default(true),
});

exports.updateChannelSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  isPublic: Joi.boolean().optional(),
});
