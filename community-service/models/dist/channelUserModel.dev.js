"use strict";

var cassandra = require('../config/cassandra');

var ChannelUserModel = {
  /**
   * Add a user to a channel
   * @param {string} channelId - The ID of the channel
   * @param {string} userId - The ID of the user
   */
  addUserToChannel: function addUserToChannel(channelId, userId) {
    var query, params;
    return regeneratorRuntime.async(function addUserToChannel$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = "\n      INSERT INTO channel_users (channel_id, user_id, joined_at)\n      VALUES (?, ?, toTimestamp(now()))\n    ";
            params = [channelId, userId];
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
   * Get all users in a channel
   * @param {string} channelId - The ID of the channel
   * @returns {Array} - Array of user IDs
   */
  getUsersInChannel: function getUsersInChannel(channelId) {
    var query, params, result;
    return regeneratorRuntime.async(function getUsersInChannel$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            query = "SELECT user_id FROM channel_users WHERE channel_id = ?";
            params = [channelId];
            _context2.next = 4;
            return regeneratorRuntime.awrap(cassandra.execute(query, params, {
              prepare: true
            }));

          case 4:
            result = _context2.sent;
            return _context2.abrupt("return", result.rows.map(function (row) {
              return row.user_id;
            }));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  },

  /**
   * Remove a user from a channel
   * @param {string} channelId - The ID of the channel
   * @param {string} userId - The ID of the user
   */
  removeUserFromChannel: function removeUserFromChannel(channelId, userId) {
    var query, params;
    return regeneratorRuntime.async(function removeUserFromChannel$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = "DELETE FROM channel_users WHERE channel_id = ? AND user_id = ?";
            params = [channelId, userId];
            _context3.next = 4;
            return regeneratorRuntime.awrap(cassandra.execute(query, params, {
              prepare: true
            }));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};
module.exports = ChannelUserModel;