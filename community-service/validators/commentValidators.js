const Joi = require("joi");

// Schema for creating a comment
const createCommentSchema = Joi.object({
  content: Joi.string().max(1000).required(),
  parentCommentId: Joi.string().guid({ version: "uuidv4" }).optional(),
});

// Schema for updating a comment
const updateCommentSchema = Joi.object({
  content: Joi.string().max(1000).optional(),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
};
