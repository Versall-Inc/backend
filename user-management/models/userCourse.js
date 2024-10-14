const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../config/database');
const User = require('./user');
const Course = require('./course');

const UserCourse = sequelize.define("UserCourse", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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

User.belongsToMany(Course, { through: UserCourse });
Course.belongsToMany(User, { through: UserCourse });

module.exports = UserCourse;