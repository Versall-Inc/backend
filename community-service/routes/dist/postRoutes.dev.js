"use strict";

var express = require('express');

var _require = require('../controllers/postController'),
    createPost = _require.createPost,
    getPostsByChannel = _require.getPostsByChannel,
    getPostById = _require.getPostById,
    deletePost = _require.deletePost,
    getAllPosts = _require.getAllPosts;

var authMiddleware = require('../middlewares/authMiddleware');

var upload = require('../middlewares/uploadMiddleware');

var router = express.Router();
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

router["delete"]('/:id', authMiddleware, deletePost);
/**
 * @route GET /posts
 * @desc Get all posts
 */

router.get('/', authMiddleware, getAllPosts);
module.exports = router;