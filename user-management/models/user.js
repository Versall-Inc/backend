const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    profileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountStatus: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    subscriptionStatus: {
      type: DataTypes.ENUM("subscribed", "unsubscribed"),
      allowNull: false,
      defaultValue: "unsubscribed",
    },
    refercode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referredBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url_linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url_github: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url_website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courses: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      validate: {
        isUnique(value) {
          if (value && value.length !== new Set(value).size) {
            throw new Error("Course IDs must be unique");
          }
        },
      },
    },
    channels: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      validate: {
        isUnique(value) {
          if (value && value.length !== new Set(value).size) {
            throw new Error("Channel IDs must be unique");
          }
        },
      },
    },
  },
  {
    timestamps: true,

    tableName: "users",
    freezeTableName: true,
  }
);

module.exports = User;
