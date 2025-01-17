const { Like, Post, Comment, Channel, ChannelMember } = require("../models");

// Helper: check if user can access a private channel
async function verifyChannelAccess(channel, userId) {
  if (channel.isPublic) {
    return true;
  }
  const member = await ChannelMember.findOne({
    where: { channelId: channel.id, userId },
  });
  return !!member;
}

/* -----------------------------------------------
   LIKE A POST
   POST /channels/:channelId/posts/:postId/likes
   Body: (none) - userId comes from req.user.id
 ----------------------------------------------- */
exports.likePost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Check post
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3) Membership check (if channel is private)
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 4) Check if user already liked this post
    const existingLike = await Like.findOne({
      where: { postId, userId },
    });
    if (existingLike) {
      return res.status(400).json({ error: "You already liked this post" });
    }

    // 5) Create the like
    const like = await Like.create({
      postId,
      userId,
      commentId: null, // Ensures we only reference a post
    });

    return res.status(201).json(like);
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* -----------------------------------------------
   UNLIKE A POST
   DELETE /channels/:channelId/posts/:postId/likes/:likeId
 ----------------------------------------------- */
exports.unlikePost = async (req, res) => {
  try {
    const { channelId, postId, likeId } = req.params;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Check post
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3) Membership check
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 4) Find the like
    const like = await Like.findByPk(likeId);
    if (!like || like.postId !== postId) {
      return res.status(404).json({ error: "Like not found" });
    }

    // 5) Ensure the user is the one who created this like
    if (like.userId !== userId) {
      // Or allow channel.ownerId === userId to also remove the like
      return res
        .status(403)
        .json({ error: "Cannot remove someone else's like" });
    }

    // 6) Destroy the like
    await like.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error unliking post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* -----------------------------------------------
   LIKE A COMMENT
   POST /channels/:channelId/posts/:postId/comments/:commentId/likes
 ----------------------------------------------- */
exports.likeComment = async (req, res) => {
  try {
    const { channelId, postId, commentId } = req.params;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Check that the post belongs to this channel
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found in channel" });
    }

    // 3) Check that the comment belongs to this post
    const comment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found in post" });
    }

    // 4) Membership check if channel is private
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 5) Check if user already liked this comment
    const existingLike = await Like.findOne({
      where: { commentId, userId },
    });
    if (existingLike) {
      return res.status(400).json({ error: "You already liked this comment" });
    }

    // 6) Create the like
    const like = await Like.create({
      commentId,
      userId,
      postId: null, // Ensures we only reference a comment
    });

    return res.status(201).json(like);
  } catch (error) {
    console.error("Error liking comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* -----------------------------------------------
   UNLIKE A COMMENT
   DELETE /channels/:channelId/posts/:postId/comments/:commentId/likes/:likeId
 ----------------------------------------------- */
exports.unlikeComment = async (req, res) => {
  try {
    const { channelId, postId, commentId, likeId } = req.params;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Check post
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found in channel" });
    }

    // 3) Check comment
    const comment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found in post" });
    }

    // 4) Membership check
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 5) Find the like
    const like = await Like.findByPk(likeId);
    if (!like || like.commentId !== commentId) {
      return res.status(404).json({ error: "Like not found" });
    }

    // 6) Check ownership
    if (like.userId !== userId) {
      // or allow channel.ownerId === userId to remove
      return res
        .status(403)
        .json({ error: "Cannot remove someone else's like" });
    }

    // 7) Destroy
    await like.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error unliking comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
