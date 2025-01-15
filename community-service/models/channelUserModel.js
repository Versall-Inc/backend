const cassandra = require("../config/cassandra");

const ChannelUserModel = {
  /**
   * Add a user to a channel
   * @param {string} channelId - The ID of the channel
   * @param {string} userId - The ID of the user
   */
  addUserToChannel: async (channelId, userId) => {
    const query = `
      INSERT INTO channel_users (channel_id, user_id, joined_at)
      VALUES (?, ?, toTimestamp(now()))
    `;
    const params = [channelId, userId];

    await cassandra.execute(query, params, { prepare: true });
  },

  /**
   * Get all users in a channel
   * @param {string} channelId - The ID of the channel
   * @returns {Array} - Array of user IDs
   */
  getUsersInChannel: async (channelId) => {
    const query = `SELECT user_id FROM channel_users WHERE channel_id = ?`;
    const params = [channelId];

    const result = await cassandra.execute(query, params, { prepare: true });
    return result.rows.map((row) => row.user_id);
  },

  /**
   * Remove a user from a channel
   * @param {string} channelId - The ID of the channel
   * @param {string} userId - The ID of the user
   */
  removeUserFromChannel: async (channelId, userId) => {
    const query = `DELETE FROM channel_users WHERE channel_id = ? AND user_id = ?`;
    const params = [channelId, userId];

    await cassandra.execute(query, params, { prepare: true });
  },
};

module.exports = ChannelUserModel;
