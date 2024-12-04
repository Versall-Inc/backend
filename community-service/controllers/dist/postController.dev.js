"use strict";

var PostModel = require('../models/postModel');
/**
 * @desc Create a new post
 * @route POST /posts
 */


exports.createPost = function _callee(req, res) {
  var _req$body, channelId, text, description, photo, newPost;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, channelId = _req$body.channelId, text = _req$body.text, description = _req$body.description;
          photo = req.file ? req.file.filename : null; // Validate input

          if (!(!channelId || !text && !description && !photo)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Channel ID and at least one content field (text, description, or photo) are required'
          }));

        case 5:
          newPost = {
            channelId: channelId,
            userId: req.user.id,
            // Extracted from the auth middleware
            text: text || null,
            description: description || null,
            photo: photo
          };
          _context.next = 8;
          return regeneratorRuntime.awrap(PostModel.create(newPost));

        case 8:
          res.status(201).json({
            message: 'Post created successfully',
            post: newPost
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error creating post:', _context.t0.message);
          res.status(500).json({
            message: 'Error creating post',
            error: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};
/**
 * @desc Get all posts for a specific channel
 * @route GET /posts/:channelId
 */


exports.getPostsByChannel = function _callee2(req, res) {
  var channelId, posts;
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
          return regeneratorRuntime.awrap(PostModel.findByChannelId(channelId));

        case 6:
          posts = _context2.sent;
          res.status(200).json({
            posts: posts
          });
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching posts:', _context2.t0.message);
          res.status(500).json({
            message: 'Error fetching posts',
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
 * @desc Get a specific post by ID
 * @route GET /posts/:id
 */


exports.getPostById = function _callee3(req, res) {
  var id, post;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;

          if (id) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Post ID is required'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(PostModel.findById(id));

        case 6:
          post = _context3.sent;

          if (post) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Post not found'
          }));

        case 9:
          res.status(200).json({
            post: post
          });
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching post:', _context3.t0.message);
          res.status(500).json({
            message: 'Error fetching post',
            error: _context3.t0.message
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};
/**
 * @desc Delete a post by ID
 * @route DELETE /posts/:id
 */


exports.deletePost = function _callee4(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;

          if (id) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Post ID is required'
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(PostModel.deleteById(id));

        case 6:
          res.status(200).json({
            message: 'Post deleted successfully'
          });
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting post:', _context4.t0.message);
          res.status(500).json({
            message: 'Error deleting post',
            error: _context4.t0.message
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};
/**
 * @desc Get all posts
 * @route GET /posts
 */


exports.getAllPosts = function _callee5(req, res) {
  var posts;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(PostModel.findAll());

        case 3:
          posts = _context5.sent;
          res.status(200).json({
            posts: posts
          });
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error('Error fetching posts:', _context5.t0.message);
          res.status(500).json({
            message: 'Error fetching posts',
            error: _context5.t0.message
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};