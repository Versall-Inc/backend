const express = require('express');
const {
  createPost,
  getPostsByChannel,
  getPostById,
  deletePost,
  getAllPosts,
} = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

/**
 * @route POST /posts
 * @desc Create a new post
 */
router.post('/', authMiddleware, upload.single('photo'), createPost);

/**
 * @route GET /posts/:channelId
 * @desc Get all posts for a specific channel
 */
router.get('/:channelId', authMiddleware, getPostsByChannel);

/**
 * @route GET /posts/post/:id
 * @desc Get a specific post by ID
 */
router.get('/post/:id', authMiddleware, getPostById);

/**
 * @route DELETE /posts/:id
 * @desc Delete a post by ID
 */
router.delete('/:id', authMiddleware, deletePost);

/**
 * @route GET /posts
 * @desc Get all posts
 */
router.get('/', authMiddleware, getAllPosts);

module.exports = router;
