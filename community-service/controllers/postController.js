const PostModel = require('../models/postModel');

/**
 * @desc Create a new post
 * @route POST /posts
 */
exports.createPost = async (req, res) => {
  try {
    const { channelId, text, description } = req.body;
    const photo = req.file ? req.file.filename : null;

    // Validate input
    if (!channelId || (!text && !description && !photo)) {
      return res.status(400).json({
        message: 'Channel ID and at least one content field (text, description, or photo) are required',
      });
    }

    const newPost = {
      channelId,
      userId: req.user.id, // Extracted from the auth middleware
      text: text || null,
      description: description || null,
      photo,
    };

    await PostModel.create(newPost);

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

/**
 * @desc Get all posts for a specific channel
 * @route GET /posts/:channelId
 */
exports.getPostsByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({ message: 'Channel ID is required' });
    }

    const posts = await PostModel.findByChannelId(channelId);

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

/**
 * @desc Get a specific post by ID
 * @route GET /posts/:id
 */
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ post });
  } catch (err) {
    console.error('Error fetching post:', err.message);
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
};

/**
 * @desc Delete a post by ID
 * @route DELETE /posts/:id
 */
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    await PostModel.deleteById(id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
};

/**
 * @desc Get all posts
 * @route GET /posts
 */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.findAll();

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};
