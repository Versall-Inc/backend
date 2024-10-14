const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.PORT, // Use the port from the .env file
  dialect: 'postgres',
  logging: false // Disable logging; default console.log
});

module.exports = sequelize;