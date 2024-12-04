"use strict";

var ChannelUserModel = require('../models/channelUserModel');
/**
 * @desc Add a user to a channel
 * @route POST /channels/:channelId/join
 */


exports.joinChannel = function _callee(req, res) {
  var channelId, userId;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          channelId = req.params.channelId;
          userId = req.user.id; // Extracted from auth middleware

          if (channelId) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Channel ID is required'
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(ChannelUserModel.addUserToChannel(channelId, userId));

        case 7:
          res.status(200).json({
            message: 'User joined the channel successfully'
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Error joining channel:', _context.t0.message);
          res.status(500).json({
            message: 'Error joining channel',
            error: _context.t0.message
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};
/**
 * @desc Get all users in a channel
 * @route GET /channels/:channelId/users
 */


exports.getUsersInChannel = function _callee2(req, res) {
  var channelId, users;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          channelId = req.params.channelId;

          if (channelId) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Channel ID is required'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(ChannelUserModel.getUsersInChannel(channelId));

        case 6:
          users = _context2.sent;
          res.status(200).json({
            users: users
          });
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching users in channel:', _context2.t0.message);
          res.status(500).json({
            message: 'Error fetching users in channel',
            error: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};
/**
 * @desc Remove a user from a channel
 * @route DELETE /channels/:channelId/users/:userId
 */


exports.removeUserFromChannel = function _callee3(req, res) {
  var _req$params, channelId, userId;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$params = req.params, channelId = _req$params.channelId, userId = _req$params.userId;

          if (!(!channelId || !userId)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Channel ID and User ID are required'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(ChannelUserModel.removeUserFromChannel(channelId, userId));

        case 6:
          res.status(200).json({
            message: 'User removed from the channel successfully'
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error('Error removing user from channel:', _context3.t0.message);
          res.status(500).json({
            message: 'Error removing user from channel',
            error: _context3.t0.message
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};