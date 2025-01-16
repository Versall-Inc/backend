const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  depth: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      max: 3,
    },
  },
  parentCommentId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = Comment;
