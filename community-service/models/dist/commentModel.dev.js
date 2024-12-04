"use strict";

var cassandra = require('../config/cassandra');

var CommentModel = {
  create: function create(comment) {
    var query, params;
    return regeneratorRuntime.async(function create$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = "\n      INSERT INTO comments (id, post_id, user_id, text, parent_id, level, created_at)\n      VALUES (?, ?, ?, ?, ?, ?, ?)\n    ";
            params = [comment.id, comment.postId, comment.userId, comment.text, comment.parentId, comment.level, comment.createdAt];
            _context.next = 4;
            return regeneratorRuntime.awrap(cassandra.execute(query, params, {
              prepare: true
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  findByPostId: function findByPostId(postId) {
    var query, params, result;
    return regeneratorRuntime.async(function findByPostId$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            query = "SELECT * FROM comments WHERE post_id = ?";
            params = [postId];
            _context2.next = 4;
            return regeneratorRuntime.awrap(cassandra.execute(query, params, {
              prepare: true
            }));

          case 4:
            result = _context2.sent;
            return _context2.abrupt("return", result.rows);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  findById: function findById(id) {
    var query, params, result;
    return regeneratorRuntime.async(function findById$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = "SELECT * FROM comments WHERE id = ?";
            params = [id];
            _context3.next = 4;
            return regeneratorRuntime.awrap(cassandra.execute(query, params, {
              prepare: true
            }));

          case 4:
            result = _context3.sent;
            return _context3.abrupt("return", result.rows[0]);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  deleteByIdWithReplies: function deleteByIdWithReplies(id) {
    var query, params;
    return regeneratorRuntime.async(function deleteByIdWithReplies$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = "DELETE FROM comments WHERE id = ? OR parent_id = ?";
            params = [id, id];
            _context4.next = 4;
            return regeneratorRuntime.awrap(cassandra.execute(query, params, {
              prepare: true
            }));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    });
  }
};
module.exports = CommentModel;