"use strict";

var cassandra = require('../config/cassandra');

var _require = require('uuid'),
    uuidv4 = _require.v4;

var PostModel = {
  /**
   * Create a new post
   * @param {Object} post - The post data to insert
   */
  create: function create(post) {
    var query, params;
    return regeneratorRuntime.async(function create$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = "\n      INSERT INTO posts (id, channel_id, user_id, text, description, photo, created_at)\n      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()))\n    ";
            params = [uuidv4(), // Generate a unique ID for the post
            post.channelId, // Channel ID
            post.userId, // User ID of the post creator
            post.text || null, // Optional text content
            post.description || null, // Optional description
            post.photo || null // Optional photo URL
            ];
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

  /**
   * Fetch all posts for a specific channel
   * @param {string} channelId - The ID of the channel
   * @returns {Array} - Array of posts
   */
  findByChannelId: function findByChannelId(channelId) {
    var query, params, result;
    return regeneratorRuntime.async(function findByChannelId$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            query = "SELECT * FROM posts WHERE channel_id = ?";
            params = [channelId];
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

  /**
   * Fetch a post by its ID
   * @param {string} id - The ID of the post
   * @returns {Object|null} - The post object if found, null otherwise
   */
  findById: function findById(id) {
    var query, params, result;
    return regeneratorRuntime.async(function findById$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = "SELECT * FROM posts WHERE id = ?";
            params = [id];
            _context3.next = 4;
            return regeneratorRuntime.awrap(cassandra.execute(query, params, {
              prepare: true
            }));

          case 4:
            result = _context3.sent;
            return _context3.abrupt("return", result.rows.length ? result.rows[0] : null);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  },

  /**
   * Delete a post by its ID
   * @param {string} id - The ID of the post
   */
  deleteById: function deleteById(id) {
    var query, params;
    return regeneratorRuntime.async(function deleteById$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = "DELETE FROM posts WHERE id = ?";
            params = [id];
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
  },

  /**
   * Fetch all posts
   * @returns {Array} - Array of all posts
   */
  findAll: function findAll() {
    var query, result;
    return regeneratorRuntime.async(function findAll$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            query = "SELECT * FROM posts";
            _context5.next = 3;
            return regeneratorRuntime.awrap(cassandra.execute(query, [], {
              prepare: true
            }));

          case 3:
            result = _context5.sent;
            return _context5.abrupt("return", result.rows);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    });
  }
};
module.exports = PostModel;