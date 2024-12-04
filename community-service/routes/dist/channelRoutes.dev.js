"use strict";

var express = require('express');

var _require = require('../controllers/channelController'),
    createChannel = _require.createChannel,
    deleteChannel = _require.deleteChannel;

var authMiddleware = require('../middlewares/authMiddleware');

var upload = require('../middlewares/uploadMiddleware'); // Handles file uploads


var router = express.Router();
/**
 * @swagger
 * /channels:
 *   post:
 *     summary: Create a new channel
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: user-id
 *         in: header
 *         required: true
 *         type: string
 *         description: User ID for authentication
 *       - name: name
 *         in: formData
 *         required: true
 *         type: string
 *         description: Name of the channel
 *       - name: handle
 *         in: formData
 *         required: true
 *         type: string
 *         description: Unique handle for the channel
 *       - name: isPrivate
 *         in: formData
 *         required: true
 *         type: boolean
 *         description: Whether the channel is private
 *       - name: photo
 *         in: formData
 *         type: file
 *         description: Optional photo for the channel
 *     responses:
 *       201:
 *         description: Channel created successfully
 *       400:
 *         description: Channel handle already exists
 *       500:
 *         description: Internal server error
 */

router.post('/', authMiddleware, upload.single('photo'), createChannel);
/**
 * @swagger
 * /channels/{id}:
 *   delete:
 *     summary: Delete a channel by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the channel to delete
 *       - name: user-id
 *         in: header
 *         required: true
 *         type: string
 *         description: User ID for authentication
 *     responses:
 *       200:
 *         description: Channel deleted successfully
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */

router["delete"]('/:id', authMiddleware, deleteChannel);
module.exports = router;