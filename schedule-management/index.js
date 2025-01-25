require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const userMiddleware = require("./middlewares/userMiddleware");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/events',userMiddleware, eventRoutes);

// Server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Schedule Management Service running on port ${PORT}`);
});
