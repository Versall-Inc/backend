"use strict";

var client = require('../config/cassandra');

var _require = require('uuid'),
    uuidv4 = _require.v4;

var ChannelModel = {
  /**
   * Create a new channel in the database
   * @param {Object} channel - The channel data to insert
   */
  create: function create(channel) {
    var query, params;
    return regeneratorRuntime.async(function create$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = "\n      INSERT INTO channels (id, name, handle, is_private, owner_id, photo, created_at)\n      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()))\n    ";
            params = [uuidv4(), // Generate a unique ID for the channel
            channel.name, channel.handle, channel.isPrivate, channel.ownerId, channel.photo || null];
            _context.next = 4;
            return regeneratorRuntime.awrap(client.execute(query, params, {
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
   * Find a channel by its unique handle
   * @param {string} handle - The unique handle of the channel
   * @returns {Object|null} - The channel object if found, null otherwise
   */
  findByHandle: function findByHandle(handle) {
    var query, params, result;
    return regeneratorRuntime.async(function findByHandle$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            query = "SELECT * FROM channels WHERE handle = ?";
            params = [handle];
            _context2.next = 4;
            return regeneratorRuntime.awrap(client.execute(query, params, {
              prepare: true
            }));

          case 4:
            result = _context2.sent;
            return _context2.abrupt("return", result.rows.length ? result.rows[0] : null);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  },

  /**
   * Delete a channel by its ID
   * @param {string} id - The ID of the channel to delete
   */
  deleteById: function deleteById(id) {
    var query, params;
    return regeneratorRuntime.async(function deleteById$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = "DELETE FROM channels WHERE id = ?";
            params = [id];
            _context3.next = 4;
            return regeneratorRuntime.awrap(client.execute(query, params, {
              prepare: true
            }));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  },

  /**
   * Get all channels (optional: filter by public/private)
   * @param {boolean|null} isPrivate - Optional filter for public or private channels
   * @returns {Array} - Array of channels
   */
  findAll: function findAll() {
    var isPrivate,
        query,
        params,
        result,
        _args4 = arguments;
    return regeneratorRuntime.async(function findAll$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            isPrivate = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : null;
            query = "SELECT * FROM channels";
            params = [];

            if (isPrivate !== null) {
              query += " WHERE is_private = ?";
              params.push(isPrivate);
            }

            _context4.next = 6;
            return regeneratorRuntime.awrap(client.execute(query, params, {
              prepare: true
            }));

          case 6:
            result = _context4.sent;
            return _context4.abrupt("return", result.rows);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    });
  }
};
module.exports = ChannelModel;