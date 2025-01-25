// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userMiddleware = require("./middlewares/userMiddleware");

// Routes
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Mongo
connectDB();

// Parse user info from headers
app.use(userMiddleware);

// Register routes
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/quiz", quizRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Course Management service running on port ${PORT}`);
});
