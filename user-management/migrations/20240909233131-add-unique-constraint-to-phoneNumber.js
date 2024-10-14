'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Users', {
      fields: ['phoneNumber'],
      type: 'unique',
      name: 'unique_phoneNumber_constraint'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Users', 'unique_phoneNumber_constraint');
  }
};