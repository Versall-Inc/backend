const express = require("express");
const courseRoutes = require("./routes/courseRoutes");
const connectDB = require("./config/db");

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", courseRoutes);

module.exports = app;
