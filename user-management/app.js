const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const userMiddleware = require("./middlewares/userMiddleware");
const logger = require("./utils/logger");
require("dotenv").config();

const app = express();

// Log the current environment
const environment = process.env.NODE_ENV || "development";
console.log(`Running in ${environment} mode`);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userMiddleware, userRoutes);
app.use(errorHandler);
// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: err.message });
});

// test route
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Synchronize database
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

module.exports = app;
