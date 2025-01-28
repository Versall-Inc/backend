require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const courseFeedbackRoutes = require('./routes/courseFeedbackRoutes');
const reportIssueRoutes = require('./routes/reportIssueRoutes');
const userMiddleware = require("./middlewares/userMiddleware");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/feedback', userMiddleware,courseFeedbackRoutes);
app.use('/api/issues',userMiddleware, reportIssueRoutes);

// Server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`report Management Service running on port ${PORT}`);
});
