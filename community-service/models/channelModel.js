const client = require("../config/cassandra");
const { v4: uuidv4 } = require("uuid");

const ChannelModel = {
  /**
   * Create a new channel in the database
   * @param {Object} channel - The channel data to insert
   */
  create: async (channel) => {
    const query = `
      INSERT INTO channels (id, name, handle, is_private, owner_id, photo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()))
    `;
    const params = [
      uuidv4(), // Generate a unique ID for the channel
      channel.name,
      channel.handle,
      channel.isPrivate,
      channel.ownerId,
      channel.photo || null,
    ];

    await client.execute(query, params, { prepare: true });
  },

  /**
   * Find a channel by its unique handle
   * @param {string} handle - The unique handle of the channel
   * @returns {Object|null} - The channel object if found, null otherwise
   */
  findByHandle: async (handle) => {
    const query = `SELECT * FROM channels WHERE handle = ?`;
    const params = [handle];

    const result = await client.execute(query, params, { prepare: true });
    return result.rows.length ? result.rows[0] : null;
  },

  /**
   * Delete a channel by its ID
   * @param {string} id - The ID of the channel to delete
   */
  deleteById: async (id) => {
    const query = `DELETE FROM channels WHERE id = ?`;
    const params = [id];

    await client.execute(query, params, { prepare: true });
  },

  /**
   * Get all channels (optional: filter by public/private)
   * @param {boolean|null} isPrivate - Optional filter for public or private channels
   * @returns {Array} - Array of channels
   */
  findAll: async (isPrivate = null) => {
    let query = `SELECT * FROM channels`;
    const params = [];

    if (isPrivate !== null) {
      query += ` WHERE is_private = ?`;
      params.push(isPrivate);
    }

    const result = await client.execute(query, params, { prepare: true });
    return result.rows;
  },
};

module.exports = ChannelModel;
