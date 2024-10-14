"use strict";

var express = require("express");

var sequelize = require("./config/database");

var authRoutes = require("./routes/authRoutes");

var userRoutes = require("./routes/userRoutes");

var errorHandler = require('./middlewares/errorHandler');

var logger = require("./utils/logger");

require("dotenv").config();

var swaggerUi = require("swagger-ui-express");

var swaggerDocument = require("./swagger.json");

var cors = require('cors');

var app = express(); // Log the current environment

var environment = process.env.NODE_ENV || 'development';
console.log("Running in ".concat(environment, " mode"));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // Ensure this line is correct

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler); // Error handling middleware

app.use(function (err, req, res, next) {
  logger.error(err.message);
  res.status(500).json({
    error: err.message
  });
}); // Start the server

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
}); // Synchronize database

sequelize.sync().then(function () {
  console.log('Database synchronized');
})["catch"](function (err) {
  console.error('Error synchronizing database:', err);
});
module.exports = app;