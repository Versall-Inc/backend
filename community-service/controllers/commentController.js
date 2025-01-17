const { Comment, Post, Channel, ChannelMember } = require("../models");

async function verifyChannelAccess(channel, userId) {
  if (channel.isPublic) {
    return true;
  }

  const member = await ChannelMember.findOne({
    where: { channelId: channel.id, userId },
  });
  return !!member;
}

/**
 * Create a new comment on a post
 */
exports.createComment = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Check if post exists in this channel
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3) Verify user is a member if channel is private
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 4) Determine depth (if replying to an existing comment)
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

    // 5) Create the comment
    const comment = await Comment.create({
      content,
      postId,
      parentCommentId: parentCommentId || null,
      depth,
      userId,
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all comments for a specific post
 */
exports.getCommentsForPost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const userId = req.user.id;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

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

/**
 * Delete a comment
 */
exports.deleteComment = async (req, res) => {
  try {
    const { channelId, postId, commentId } = req.params;
    const userId = req.user.id;

    // 1) Check if channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Check if post exists in this channel
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3) Verify the comment exists
    const comment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // 4) Verify user is a member if channel is private
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 5) Check ownership: user can delete their own comment,
    //    or the channel owner can delete any comment.
    if (comment.userId !== userId && channel.ownerId !== userId) {
      return res.status(403).json({ error: "Access denied: not your comment" });
    }

    // 6) Delete the comment
    await comment.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a specific comment
 */
exports.updateComment = async (req, res) => {
  try {
    const { channelId, postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // 1. Check if channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2. Check if post exists in this channel
    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3. Check if comment exists and belongs to this post
    const comment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // 4. Verify user is a member if channel is private
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 5. Check ownership: user can update their own comment or channel owner can update any comment
    if (comment.userId !== userId && channel.ownerId !== userId) {
      return res.status(403).json({ error: "Access denied: not your comment" });
    }

    // 6. Update the comment
    if (content) {
      comment.content = content;
      await comment.save();
    }

    return res.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
