const Joi = require("joi");

exports.createCommentSchema = Joi.object({
  content: Joi.string().max(1000).required(),
  parentCommentId: Joi.string().uuid().allow(null).optional(),
});
