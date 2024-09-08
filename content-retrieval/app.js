const express = require("express");
const contentRoutes = require("./routes/contentRoutes");
const logger = require("./utils/logger");
const { registerMonitoring } = require("./utils/monitoring");

const app = express();

app.use(express.json());
app.use("/api/content", contentRoutes);

// Monitoring endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", registerMonitoring.contentType);
  res.end(await registerMonitoring.metrics());
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: err.message });
});

module.exports = app;
