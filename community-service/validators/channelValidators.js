const Joi = require("joi");

const channelTopics = [
  "Education & Training",
  "Intellisupport and Q&A",
  "Hobbies & Interests",
  "Social & Networking",
  "Science & Mathematics",
  "Technology & Innovation",
  "Arts & Creative Practices",
  "Business & Management",
  "Language & Communication",
  "Other",
];

// Schema for creating a channel
const createChannelSchema = Joi.object({
  name: Joi.string().max(100).required(),
  isPublic: Joi.boolean().optional(),
  topic: Joi.string()
    .valid(...channelTopics)
    .required(),
});

// Schema for updating a channel
const updateChannelSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  isPublic: Joi.boolean().optional(),
  topic: Joi.string()
    .valid(...channelTopics)
    .optional(),
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
