const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  channelId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(2000),
    allowNull: false,
  },
});

module.exports = Post;
