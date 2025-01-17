const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const validate = require("../middlewares/validate");

// Import Joi schemas
const {
  createCommentSchema,
  updateCommentSchema,
} = require("../validators/commentValidators");

// ------------------------
// Comment CRUD Routes
// ------------------------

// Create a new comment on a post
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

// Delete a specific comment
router.delete(
  "/:channelId/posts/:postId/comments/:commentId",
  commentController.deleteComment
);

// (Optional) Update a specific comment
router.put(
  "/:channelId/posts/:postId/comments/:commentId",
  validate(updateCommentSchema),
  commentController.updateComment
);

module.exports = router;
