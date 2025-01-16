const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const validate = require("../middlewares/validate");

// Import Joi schemas
const { createCommentSchema } = require("../validators/commentValidators");

// Create a comment for a post
router.post(
  "/:channelId/posts/:postId/comments",
  validate(createCommentSchema),
  commentController.createComment
);

// Get all comments for a post
router.get(
  "/:channelId/posts/:postId/comments",
  commentController.getCommentsForPost
);

// Delete a comment
router.delete(
  "/:channelId/posts/:postId/comments/:commentId",
  commentController.deleteComment
);

module.exports = router;
