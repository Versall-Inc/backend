const express = require('express');
const {
  joinChannel,
  getUsersInChannel,
  removeUserFromChannel,
} = require('../controllers/channelUserController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route POST /channels/:channelId/join
 * @desc Add a user to a channel
 */
router.post('/:channelId/join', authMiddleware, joinChannel);

/**
 * @route GET /channels/:channelId/users
 * @desc Get all users in a channel
 */
router.get('/:channelId/users', authMiddleware, getUsersInChannel);

/**
 * @route DELETE /channels/:channelId/users/:userId
 * @desc Remove a user from a channel
 */
router.delete('/:channelId/users/:userId', authMiddleware, removeUserFromChannel);

module.exports = router;
