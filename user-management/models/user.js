const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const interests = [
  "Technology",
  "Design",
  "Biology",
  "Mathematics",
  "Culinary",
  "History",
  "Literature",
  "Marketing",
  "Time Management",
  "Other",
];

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
    bio: {
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
    interests: {
      type: DataTypes.ARRAY(DataTypes.ENUM(interests)),
      allowNull: true,
    },
    specialities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    timestamps: true,

    tableName: "users",
    freezeTableName: true,
  }
);

module.exports = User;
