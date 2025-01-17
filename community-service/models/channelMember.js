const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChannelMember = sequelize.define("ChannelMember", {
  channelId: { type: DataTypes.UUID, primaryKey: true },
  userId: { type: DataTypes.UUID, primaryKey: true },
});

module.exports = ChannelMember;
