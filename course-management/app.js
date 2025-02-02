// app.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userMiddleware = require("./middlewares/userMiddleware");
const errorHandler = require("./middlewares/errorHandler");

// Routes
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const chaptersRoutes = require("./routes/chapterRoutes");

const app = express();

// Connect to Mongo
connectDB();

// Parse user info from headers
app.use(express.json());
app.use(userMiddleware);

// Register routes
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/quiz", quizRoutes);
app.use("/chapters", chaptersRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Course Management service running on port ${PORT}`);
});
