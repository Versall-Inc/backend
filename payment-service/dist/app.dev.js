"use strict";

require('dotenv').config();

var express = require('express');

var dotenv = require('dotenv');

var paymentRoutes = require('./routes/paymentRoutes');

var connectDB = require('./config/db');

connectDB();
dotenv.config();
var app = express();
app.use(express.json());
app.use('/api', paymentRoutes);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});
module.exports = app;