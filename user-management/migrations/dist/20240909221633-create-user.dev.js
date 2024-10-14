'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function up$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(queryInterface.createTable('Users', {
              id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.fn('uuid_generate_v4'),
                primaryKey: true
              },
              firstName: {
                type: Sequelize.STRING,
                allowNull: false
              },
              middleName: {
                type: Sequelize.STRING,
                allowNull: true
              },
              lastName: {
                type: Sequelize.STRING,
                allowNull: false
              },
              address: {
                type: Sequelize.STRING,
                allowNull: false
              },
              phoneNumber: {
                type: Sequelize.STRING,
                allowNull: false
              },
              email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                  isEmail: true
                }
              },
              username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
              },
              password: {
                type: Sequelize.STRING,
                allowNull: false
              },
              role: {
                type: Sequelize.ENUM('user', 'admin'),
                allowNull: false,
                defaultValue: 'user'
              },
              accountStatus: {
                type: Sequelize.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active'
              },
              createdAt: {
                type: Sequelize.DATE,
                allowNull: false
              },
              updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
              }
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  down: function down(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function down$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(queryInterface.dropTable('Users'));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};