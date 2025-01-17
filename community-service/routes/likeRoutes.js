const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

// ------------------------
// Like Routes for Posts
// ------------------------

// Like a post
router.post(
  "/channels/:channelId/posts/:postId/likes",
  likeController.likePost
);

// Unlike a post
router.delete(
  "/channels/:channelId/posts/:postId/likes/:likeId",
  likeController.unlikePost
);

// ------------------------
// Like Routes for Comments
// ------------------------

// Like a comment
router.post(
  "/channels/:channelId/posts/:postId/comments/:commentId/likes",
  likeController.likeComment
);

// Unlike a comment
router.delete(
  "/channels/:channelId/posts/:postId/comments/:commentId/likes/:likeId",
  likeController.unlikeComment
);

module.exports = router;
