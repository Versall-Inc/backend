const { Post, Channel } = require("../models");

exports.createPost = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    // const userId = req.user.id;  // assume we have the user info

    // Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // If channel is private, ensure user has access (assume function or check)
    // if (!channel.isPublic && !userIsInChannel(req.user.id, channelId)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    const post = await Post.create({
      content,
      channelId,
      // userId
    });
    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostsByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // If channel is private, ensure user has access
    // if (!channel.isPublic && !userIsInChannel(req.user.id, channelId)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    const posts = await Post.findAll({ where: { channelId } });
    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { channelId, postId } = req.params;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // If channel is private, ensure user has access
    // if (!channel.isPublic && !userIsInChannel(req.user.id, channelId)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const { content } = req.body;

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If channel is private, check user access
    // if (!channel.isPublic && post.userId !== req.user.id) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    post.content = content ?? post.content;
    await post.save();

    return res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const post = await Post.findOne({ where: { id: postId, channelId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If channel is private, check user access
    // if (!channel.isPublic && post.userId !== req.user.id) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    await post.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
