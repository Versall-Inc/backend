"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CommentModel = require('../models/commentModel');

var _require = require('uuid'),
    uuidv4 = _require.v4; // Create a new comment or reply


exports.createComment = function _callee(req, res) {
  var _req$body, postId, text, parentId, level, parentComment, newComment;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, postId = _req$body.postId, text = _req$body.text, parentId = _req$body.parentId; // Validate input

          if (!(!postId || !text)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Post ID and text are required'
          }));

        case 4:
          level = 1; // Determine the comment level based on parentId

          if (!parentId) {
            _context.next = 14;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(CommentModel.findById(parentId));

        case 8:
          parentComment = _context.sent;

          if (parentComment) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Parent comment does not exist'
          }));

        case 11:
          level = parentComment.level + 1;

          if (!(level > 3)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Replies are limited to 3 levels'
          }));

        case 14:
          newComment = {
            id: uuidv4(),
            postId: postId,
            userId: req.user.id,
            text: text,
            parentId: parentId || null,
            level: level,
            createdAt: new Date()
          };
          _context.next = 17;
          return regeneratorRuntime.awrap(CommentModel.create(newComment));

        case 17:
          res.status(201).json({
            message: 'Comment created successfully',
            comment: newComment
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.error('Error creating comment:', _context.t0.message);
          res.status(500).json({
            message: 'Error creating comment',
            error: _context.t0.message
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
}; // Get all comments for a post (with 3-level hierarchy)


exports.getCommentsByPost = function _callee2(req, res) {
  var postId, comments, commentTree;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          postId = req.params.postId;

          if (postId) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Post ID is required'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(CommentModel.findByPostId(postId));

        case 6:
          comments = _context2.sent;
          // Build the 3-level hierarchy
          commentTree = comments.filter(function (c) {
            return c.level === 1;
          }).map(function (comment) {
            return _objectSpread({}, comment, {
              replies: comments.filter(function (reply) {
                return reply.parent_id === comment.id && reply.level === 2;
              }).map(function (reply) {
                return _objectSpread({}, reply, {
                  subReplies: comments.filter(function (subReply) {
                    return subReply.parent_id === reply.id && subReply.level === 3;
                  })
                });
              })
            });
          });
          res.status(200).json({
            comments: commentTree
          });
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching comments:', _context2.t0.message);
          res.status(500).json({
            message: 'Error fetching comments',
            error: _context2.t0.message
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Delete a comment and its replies


exports.deleteComment = function _callee3(req, res) {
  var id;
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
            message: 'Comment ID is required'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(CommentModel.deleteByIdWithReplies(id));

        case 6:
          res.status(200).json({
            message: 'Comment deleted successfully'
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error('Error deleting comment:', _context3.t0.message);
          res.status(500).json({
            message: 'Error deleting comment',
            error: _context3.t0.message
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};