const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Like = sequelize.define(
  "Like",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    postId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    commentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    validate: {
      mustReferenceExactlyOne() {
        if (
          (!this.postId && !this.commentId) ||
          (this.postId && this.commentId)
        ) {
          throw new Error(
            "Like must reference exactly one of postId or commentId"
          );
        }
      },
    },
  }
);

module.exports = Like;
