// app.js
const express = require("express");
const assignmentRoutes = require("./routes/assignmentRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api", assignmentRoutes);

app.listen(PORT, () => {
  console.log(`Assignment Management Service is running on port ${PORT}`);
});
