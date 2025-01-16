const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Channel = sequelize.define("Channel", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  members: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: true,
    validate: {
      isUnique(value) {
        if (value && value.length !== new Set(value).size) {
          throw new Error("Member IDs must be unique");
        }
      },
    },
  },
});

module.exports = Channel;
