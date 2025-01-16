const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const validate = require("../middlewares/validate");

// Import Joi schemas
const { likePostSchema } = require("../validators/likeValidators");

// Like a post
router.post(
  "/:channelId/posts/:postId/likes",
  validate(likePostSchema),
  likeController.likePost
);

// Unlike a post
router.delete(
  "/:channelId/posts/:postId/likes/:likeId",
  likeController.unlikePost
);

module.exports = router;
