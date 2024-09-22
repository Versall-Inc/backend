"use strict";

var _require = require("sequelize"),
    Sequelize = _require.Sequelize,
    DataTypes = _require.DataTypes;

var sequelize = require('../config/database');

var User = require('./user');

var Course = require('./course');

var UserCourse = sequelize.define("UserCourse", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id'
    }
  }
});
User.belongsToMany(Course, {
  through: UserCourse
});
Course.belongsToMany(User, {
  through: UserCourse
});
module.exports = UserCourse;