const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validate = require("../middlewares/validate");

// Import Joi schemas
const {
  createPostSchema,
  updatePostSchema,
} = require("../validators/postValidators");

// Create new post in a channel
router.post(
  "/:channelId/posts",
  validate(createPostSchema),
  postController.createPost
);

// Get all posts in a channel
router.get("/:channelId/posts", postController.getPostsByChannel);

// Get a single post by ID
router.get("/:channelId/posts/:postId", postController.getPostById);

// Update a post
router.put(
  "/:channelId/posts/:postId",
  validate(updatePostSchema),
  postController.updatePost
);

// Delete a post
router.delete("/:channelId/posts/:postId", postController.deletePost);

module.exports = router;
