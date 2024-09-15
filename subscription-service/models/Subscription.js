// models/Subscription.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subscription = sequelize.define("Subscription", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "canceled", "past_due"),
    allowNull: false,
  },
  planId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endDate: {
    type: DataTypes.DATE,
  },
});

module.exports = Subscription;
