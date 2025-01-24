const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validate = require("../middlewares/validate");

// Import Joi schemas
const {
  createPostSchema,
  updatePostSchema,
  paginatePostsSchema,
  searchPostsSchema,
} = require("../validators/postValidators");

// ------------------------
// Post CRUD Routes
// ------------------------

// Create a new post in a channel
router.post(
  "/:channelId/posts",
  validate(createPostSchema),
  postController.createPost
);

// Get all posts in a channel
router.get("/:channelId/posts", postController.getPostsByChannel);

// Get a specific post by ID within a channel
router.get("/:channelId/posts/:postId", postController.getPostById);

// Update a specific post by ID within a channel
router.put(
  "/:channelId/posts/:postId",
  validate(updatePostSchema),
  postController.updatePost
);

// Delete a specific post by ID within a channel
router.delete("/:channelId/posts/:postId", postController.deletePost);

// ------------------------
// Additional Post Routes
// ------------------------

// Get post details with comments and likes
router.get("/:channelId/posts/:postId/details", postController.getPostDetails);

// Paginate posts within a channel
router.get(
  "/:channelId/paginate/posts",
  validate(paginatePostsSchema),
  postController.getPostsByChannelWithPagination
);

// Search posts within a channel
router.get(
  "/:channelId/posts/search",
  validate(searchPostsSchema),
  postController.searchPostsInChannel
);

module.exports = router;
