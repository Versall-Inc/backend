// app.js
const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Payment Service is running on port ${PORT}`);
});
