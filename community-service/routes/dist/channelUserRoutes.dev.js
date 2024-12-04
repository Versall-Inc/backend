"use strict";

var express = require('express');

var _require = require('../controllers/channelUserController'),
    joinChannel = _require.joinChannel,
    getUsersInChannel = _require.getUsersInChannel,
    removeUserFromChannel = _require.removeUserFromChannel;

var authMiddleware = require('../middlewares/authMiddleware');

var router = express.Router();
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

router["delete"]('/:channelId/users/:userId', authMiddleware, removeUserFromChannel);
module.exports = router;