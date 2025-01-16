const { Comment, Post, Channel } = require("../models");

exports.createComment = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const { content, parentCommentId } = req.body;
    // const userId = req.user.id;

    // Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Check post
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If channel is private, ensure user has access
    // if (!channel.isPublic && !userIsInChannel(userId, channelId)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    let depth = 1;
    if (parentCommentId) {
      const parentComment = await Comment.findByPk(parentCommentId);
      if (!parentComment) {
        return res.status(400).json({ error: "Parent comment does not exist" });
      }
      if (parentComment.postId !== postId) {
        return res
          .status(400)
          .json({ error: "Parent comment belongs to a different post" });
      }
      if (parentComment.depth >= 3) {
        return res
          .status(400)
          .json({ error: "Maximum comment nesting depth reached" });
      }
      depth = parentComment.depth + 1;
    }

    const comment = await Comment.create({
      content,
      postId,
      parentCommentId: parentCommentId || null,
      depth,
      // userId,
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCommentsForPost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;

    // Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Check post
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If channel is private, ensure user has access
    // if (!channel.isPublic && !userIsInChannel(req.user.id, channelId)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    // Get all comments (you could also build a nested hierarchy structure)
    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "ASC"]],
    });

    return res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { channelId, postId, commentId } = req.params;

    // Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Check post
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // if (comment.userId !== req.user.id) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    await comment.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
