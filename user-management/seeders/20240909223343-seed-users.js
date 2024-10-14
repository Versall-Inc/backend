'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: Sequelize.fn('uuid_generate_v4'),
        username: 'john_doe',
        firstName: 'John',
        middleName: 'A.',
        lastName: 'Doe',
        address: '123 Main St',
        phoneNumber: '123-456-7890',
        email: 'john@example.com',
        password: 'password123', // Note: In a real application, ensure passwords are hashed
        role: 'user',
        accountStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.fn('uuid_generate_v4'),
        username: 'jane_smith',
        firstName: 'Jane',
        middleName: 'B.',
        lastName: 'Smith',
        address: '456 Elm St',
        phoneNumber: '987-654-3210',
        email: 'jane@example.com',
        password: 'password123', // Note: In a real application, ensure passwords are hashed
        role: 'admin',
        accountStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.fn('uuid_generate_v4'),
        username: 'alice_johnson',
        firstName: 'Alice',
        middleName: 'C.',
        lastName: 'Johnson',
        address: '789 Oak St',
        phoneNumber: '555-123-4567',
        email: 'alice@example.com',
        password: 'password123', // Note: In a real application, ensure passwords are hashed
        role: 'user',
        accountStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.fn('uuid_generate_v4'),
        username: 'bob_brown',
        firstName: 'Bob',
        middleName: 'D.',
        lastName: 'Brown',
        address: '101 Pine St',
        phoneNumber: '555-987-6543',
        email: 'bob@example.com',
        password: 'password123', // Note: In a real application, ensure passwords are hashed
        role: 'user',
        accountStatus: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};