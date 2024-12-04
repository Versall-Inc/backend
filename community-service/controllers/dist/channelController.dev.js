"use strict";

var ChannelModel = require('../models/channelModel');

var _require = require('uuid'),
    uuidv4 = _require.v4;
/**
 * @desc Create a new channel
 * @route POST /channels
 */


exports.createChannel = function _callee(req, res) {
  var _req$body, name, handle, isPrivate, existingChannel, photo;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, handle = _req$body.handle, isPrivate = _req$body.isPrivate; // Check if the handle already exists

          _context.next = 4;
          return regeneratorRuntime.awrap(ChannelModel.findByHandle(handle));

        case 4:
          existingChannel = _context.sent;

          if (!existingChannel) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Channel handle already exists'
          }));

        case 7:
          photo = req.file ? req.file.filename : null; // Create the channel

          _context.next = 10;
          return regeneratorRuntime.awrap(ChannelModel.create({
            name: name,
            handle: handle,
            isPrivate: isPrivate === 'true',
            // Convert string "true"/"false" to boolean
            ownerId: req.user.id,
            // Extracted from authentication middleware
            photo: photo
          }));

        case 10:
          res.status(201).json({
            message: 'Channel created successfully'
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Error creating channel:', _context.t0.message);
          res.status(500).json({
            message: 'Error creating channel',
            error: _context.t0.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};
/**
 * @desc Get all channels
 * @route GET /channels
 */


exports.getChannels = function _callee2(req, res) {
  var isPrivate, isPrivateFilter, channels;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          isPrivate = req.query.isPrivate; // If isPrivate is provided, convert it to boolean

          isPrivateFilter = isPrivate === 'true' ? true : isPrivate === 'false' ? false : null; // Fetch all channels (with optional isPrivate filter)

          _context2.next = 5;
          return regeneratorRuntime.awrap(ChannelModel.findAll(isPrivateFilter));

        case 5:
          channels = _context2.sent;
          res.status(200).json({
            channels: channels
          });
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching channels:', _context2.t0.message);
          res.status(500).json({
            message: 'Error fetching channels',
            error: _context2.t0.message
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};
/**
 * @desc Get a single channel by handle
 * @route GET /channels/:handle
 */


exports.getChannelByHandle = function _callee3(req, res) {
  var handle, channel;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          handle = req.params.handle; // Fetch the channel by handle

          _context3.next = 4;
          return regeneratorRuntime.awrap(ChannelModel.findByHandle(handle));

        case 4:
          channel = _context3.sent;

          if (channel) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Channel not found'
          }));

        case 7:
          res.status(200).json({
            channel: channel
          });
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching channel:', _context3.t0.message);
          res.status(500).json({
            message: 'Error fetching channel',
            error: _context3.t0.message
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};
/**
 * @desc Delete a channel by ID
 * @route DELETE /channels/:id
 */


exports.deleteChannel = function _callee4(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id; // Delete the channel

          _context4.next = 4;
          return regeneratorRuntime.awrap(ChannelModel.deleteById(id));

        case 4:
          res.status(200).json({
            message: 'Channel deleted successfully'
          });
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting channel:', _context4.t0.message);
          res.status(500).json({
            message: 'Error deleting channel',
            error: _context4.t0.message
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};