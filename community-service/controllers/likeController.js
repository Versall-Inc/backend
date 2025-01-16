const { Like, Post, Channel } = require("../models");

exports.likePost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
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

    // Ensure we haven't already liked the post
    // const existingLike = await Like.findOne({ where: { postId, userId } });
    // if (existingLike) {
    //   return res.status(400).json({ error: 'You already liked this post' });
    // }

    const like = await Like.create({
      postId,
      // userId
    });

    return res.status(201).json(like);
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { channelId, postId, likeId } = req.params;
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

    const like = await Like.findByPk(likeId);
    if (!like || like.postId !== postId) {
      return res.status(404).json({ error: "Like not found" });
    }

    // if (like.userId !== userId) {
    //   return res.status(403).json({ error: 'Cannot unlike on behalf of another user' });
    // }

    await like.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error unliking post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
