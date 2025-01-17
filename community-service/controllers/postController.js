const { Post, Channel, ChannelMember } = require("../models");

// Helper: verify the user can at least "access" the channel
async function verifyChannelAccess(channel, userId) {
  // If public, no membership check needed
  if (channel.isPublic) {
    return true;
  }

  // If private, user must be in ChannelMember
  const member = await ChannelMember.findOne({
    where: { channelId: channel.id, userId },
  });
  return !!member; // true if found, false if not
}

// Helper: verify the user can "modify" (update/delete) the post
function canUserModifyPost(post, channel, userId) {
  // The post’s author or the channel’s owner can modify
  return post.userId === userId || channel.ownerId === userId;
}

/**
 * Create a new post in a channel
 */
exports.createPost = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Authenticated user

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) If channel is private, verify membership
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 3) Create the post
    const post = await Post.create({
      content,
      channelId,
      userId, // store the author's ID
    });
    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all posts in a channel
 */
exports.getPostsByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) If channel is private, verify membership
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 3) Fetch all posts in this channel
    const posts = await Post.findAll({ where: { channelId } });
    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by channel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single post by ID within a channel
 */
exports.getPostById = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) If channel is private, verify membership
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 3) Check that the post is in this channel
    const post = await Post.findOne({
      where: { id: postId, channelId },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a post (only post owner or channel owner)
 */
exports.updatePost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Find post
    const post = await Post.findOne({
      where: { id: postId, channelId },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3) Verify user can access channel
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 4) Check if user can modify the post
    if (!canUserModifyPost(post, channel, userId)) {
      return res.status(403).json({ error: "Access denied: not your post" });
    }

    // 5) Update post
    post.content = content ?? post.content;
    await post.save();

    return res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a post (only post owner or channel owner)
 */
exports.deletePost = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const userId = req.user.id;

    // 1) Check channel
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Find post
    const post = await Post.findOne({
      where: { id: postId, channelId },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3) Verify user can access channel
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 4) Check if user can modify the post (owner or channel owner)
    if (!canUserModifyPost(post, channel, userId)) {
      return res.status(403).json({ error: "Access denied: not your post" });
    }

    // 5) Delete post
    await post.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------
// Additional Controller Methods
// ------------------------

/**
 * Get post details including comments and likes
 */
exports.getPostDetails = async (req, res) => {
  try {
    const { channelId, postId } = req.params;
    const userId = req.user.id;

    // 1. Check if channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2. If channel is private, verify membership
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 3. Fetch the post with associated comments and likes
    const post = await Post.findOne({
      where: { id: postId, channelId },
      include: [
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: Comment,
              as: "replies",
            },
          ],
        },
        {
          model: Like,
          as: "likes",
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("Error fetching post details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts within a channel with pagination
 */
exports.getPostsByChannelWithPagination = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;
    const { page, limit } = req.query;

    const offset = (page - 1) * limit;

    // 1. Check if channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2. If channel is private, verify membership
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 3. Fetch paginated posts
    const { count, rows: posts } = await Post.findAndCountAll({
      where: { channelId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      posts,
    });
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Search posts within a channel based on keyword
 */
exports.searchPostsInChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;
    const { keyword, page, limit } = req.query;

    const offset = (page - 1) * limit;

    // 1. Check if channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2. If channel is private, verify membership
    const hasAccess = await verifyChannelAccess(channel, userId);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "Access denied: not a channel member" });
    }

    // 3. Search for posts containing the keyword in their content
    const { count, rows: posts } = await Post.findAndCountAll({
      where: {
        channelId,
        content: {
          [Op.iLike]: `%${keyword}%`, // Case-insensitive search
        },
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      posts,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
