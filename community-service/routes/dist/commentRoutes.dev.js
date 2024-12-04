"use strict";

var express = require('express');

var _require = require('../controllers/commentController'),
    createComment = _require.createComment,
    getCommentsByPost = _require.getCommentsByPost,
    deleteComment = _require.deleteComment;

var authMiddleware = require('../middlewares/authMiddleware');

var router = express.Router();
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: user-id
 *         in: header
 *         required: true
 *         type: string
 *         description: User ID for authentication
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             postId:
 *               type: string
 *               description: ID of the post the comment belongs to
 *             text:
 *               type: string
 *               description: Content of the comment
 *             parentId:
 *               type: string
 *               description: (Optional) ID of the parent comment for a reply
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input or missing fields
 *       500:
 *         description: Internal server error
 */

router.post('/', authMiddleware, createComment);
/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get all comments for a specific post
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the post to fetch comments for
 *       - name: user-id
 *         in: header
 *         required: true
 *         type: string
 *         description: User ID for authentication
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             comments:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   postId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   text:
 *                     type: string
 *                   parentId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Post ID is required
 *       500:
 *         description: Internal server error
 */

router.get('/:postId', authMiddleware, getCommentsByPost);
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the comment to delete
 *       - name: user-id
 *         in: header
 *         required: true
 *         type: string
 *         description: User ID for authentication
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

router["delete"]('/:id', authMiddleware, deleteComment);
module.exports = router;