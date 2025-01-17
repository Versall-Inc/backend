const sequelize = require("../config/database");
const Channel = require("./channel");
const Post = require("./post");
const Comment = require("./comment");
const Like = require("./like");
const ChannelMember = require("./channelMember");

// -------------------------------------------------------------------------
// Channel <-> Post
// -------------------------------------------------------------------------
Channel.hasMany(Post, {
  as: "posts",
  foreignKey: "channelId",
});
Post.belongsTo(Channel, {
  as: "channel",
  foreignKey: "channelId",
});

// -------------------------------------------------------------------------
// Post <-> Comment
// -------------------------------------------------------------------------
Post.hasMany(Comment, {
  as: "comments",
  foreignKey: "postId",
});
Comment.belongsTo(Post, {
  as: "post",
  foreignKey: "postId",
});

// -------------------------------------------------------------------------
// Post <-> Like
// -------------------------------------------------------------------------
Post.hasMany(Like, {
  as: "likes",
  foreignKey: "postId",
});
Like.belongsTo(Post, {
  as: "post",
  foreignKey: "postId",
});

// -------------------------------------------------------------------------
// Comment <-> Like
// -------------------------------------------------------------------------
Comment.hasMany(Like, {
  as: "likes",
  foreignKey: "commentId",
});
Like.belongsTo(Comment, {
  as: "comment",
  foreignKey: "commentId",
});

// -------------------------------------------------------------------------
// Comment self-reference
// -------------------------------------------------------------------------
Comment.belongsTo(Comment, {
  as: "parentComment",
  foreignKey: "parentCommentId",
});
Comment.hasMany(Comment, {
  as: "replies",
  foreignKey: "parentCommentId",
});

// -------------------------------------------------------------------------
// Channel <-> ChannelMember
// -------------------------------------------------------------------------
Channel.hasMany(ChannelMember, {
  foreignKey: "channelId",
  onDelete: "CASCADE",
});
ChannelMember.belongsTo(Channel, {
  foreignKey: "channelId",
  onDelete: "CASCADE",
});

// -------------------------------------------------------------------------
// Export all models
// -------------------------------------------------------------------------
module.exports = {
  Channel,
  Post,
  Comment,
  Like,
  ChannelMember,
  sequelize,
};
