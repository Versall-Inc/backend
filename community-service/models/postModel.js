const cassandra = require('../config/cassandra');
const { v4: uuidv4 } = require('uuid');

const PostModel = {
  /**
   * Create a new post
   * @param {Object} post - The post data to insert
   */
  create: async (post) => {
    const query = `
      INSERT INTO posts (id, channel_id, user_id, text, description, photo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()))
    `;
    const params = [
      uuidv4(),            // Generate a unique ID for the post
      post.channelId,      // Channel ID
      post.userId,         // User ID of the post creator
      post.text || null,   // Optional text content
      post.description || null, // Optional description
      post.photo || null,  // Optional photo URL
    ];

    await cassandra.execute(query, params, { prepare: true });
  },

  /**
   * Fetch all posts for a specific channel
   * @param {string} channelId - The ID of the channel
   * @returns {Array} - Array of posts
   */
  findByChannelId: async (channelId) => {
    const query = `SELECT * FROM posts WHERE channel_id = ?`;
    const params = [channelId];

    const result = await cassandra.execute(query, params, { prepare: true });
    return result.rows;
  },

  /**
   * Fetch a post by its ID
   * @param {string} id - The ID of the post
   * @returns {Object|null} - The post object if found, null otherwise
   */
  findById: async (id) => {
    const query = `SELECT * FROM posts WHERE id = ?`;
    const params = [id];

    const result = await cassandra.execute(query, params, { prepare: true });
    return result.rows.length ? result.rows[0] : null;
  },

  /**
   * Delete a post by its ID
   * @param {string} id - The ID of the post
   */
  deleteById: async (id) => {
    const query = `DELETE FROM posts WHERE id = ?`;
    const params = [id];

    await cassandra.execute(query, params, { prepare: true });
  },

  /**
   * Fetch all posts
   * @returns {Array} - Array of all posts
   */
  findAll: async () => {
    const query = `SELECT * FROM posts`;

    const result = await cassandra.execute(query, [], { prepare: true });
    return result.rows;
  },
};

module.exports = PostModel;
