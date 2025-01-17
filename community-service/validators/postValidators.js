const Joi = require("joi");

// Schema for creating a post
const createPostSchema = Joi.object({
  content: Joi.string().max(2000).required(),
  // You can add more fields like images, tags, etc., if needed
});

// Schema for updating a post
const updatePostSchema = Joi.object({
  content: Joi.string().max(2000).optional(),
  // Add other updatable fields here
});

// Schema for paginating posts
const paginatePostsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

// Schema for searching posts
const searchPostsSchema = Joi.object({
  keyword: Joi.string().min(1).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  paginatePostsSchema,
  searchPostsSchema,
};
