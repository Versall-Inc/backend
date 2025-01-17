const Joi = require("joi");

// Schema for creating a channel
const createChannelSchema = Joi.object({
  name: Joi.string().max(100).required(),
  isPublic: Joi.boolean().optional(),
});

// Schema for updating a channel
const updateChannelSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  isPublic: Joi.boolean().optional(),
});

// Schema for adding a member to a channel
const addMemberSchema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
});

module.exports = {
  createChannelSchema,
  updateChannelSchema,
  addMemberSchema,
};
