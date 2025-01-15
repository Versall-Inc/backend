const cassandra = require("../config/cassandra");

const CommentModel = {
  create: async (comment) => {
    const query = `
      INSERT INTO comments (id, post_id, user_id, text, parent_id, level, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      comment.id,
      comment.postId,
      comment.userId,
      comment.text,
      comment.parentId,
      comment.level,
      comment.createdAt,
    ];

    await cassandra.execute(query, params, { prepare: true });
  },

  findByPostId: async (postId) => {
    const query = `SELECT * FROM comments WHERE post_id = ?`;
    const params = [postId];

    const result = await cassandra.execute(query, params, { prepare: true });
    return result.rows;
  },

  findById: async (id) => {
    const query = `SELECT * FROM comments WHERE id = ?`;
    const params = [id];

    const result = await cassandra.execute(query, params, { prepare: true });
    return result.rows[0];
  },

  deleteByIdWithReplies: async (id) => {
    const query = `DELETE FROM comments WHERE id = ? OR parent_id = ?`;
    const params = [id, id];

    await cassandra.execute(query, params, { prepare: true });
  },
};

module.exports = CommentModel;
