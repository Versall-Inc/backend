// app.js
const express = require("express");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/api", subscriptionRoutes);

app.listen(PORT, () => {
  console.log(`Subscription Service is running on port ${PORT}`);
});
