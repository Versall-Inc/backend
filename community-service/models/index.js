const sequelize = require("../config/database");
const Channel = require("./channel");
const Post = require("./post");
const Like = require("./like");
const Comment = require("./comment");

// ------------------- ASSOCIATIONS -------------------

// A Channel has many Posts
Channel.hasMany(Post, { foreignKey: "channelId", onDelete: "CASCADE" });
Post.belongsTo(Channel, { foreignKey: "channelId" });

// A Post has many Likes
Post.hasMany(Like, { foreignKey: "postId", onDelete: "CASCADE" });
Like.belongsTo(Post, { foreignKey: "postId" });

// A Post has many Comments
Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// A Comment can have replies (self-relation)
// This allows nesting of comments
Comment.hasMany(Comment, {
  foreignKey: "parentCommentId",
  as: "replies",
  onDelete: "CASCADE",
});
Comment.belongsTo(Comment, {
  foreignKey: "parentCommentId",
  as: "parent",
});

// Export models and sequelize connection
module.exports = {
  sequelize,
  Channel,
  Post,
  Like,
  Comment,
};
