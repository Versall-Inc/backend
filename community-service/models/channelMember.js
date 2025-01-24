const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChannelMember = sequelize.define("ChannelMember", {
  channelId: { type: DataTypes.UUID, primaryKey: true },
  userId: { type: DataTypes.UUID, primaryKey: true },
  pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = ChannelMember;
