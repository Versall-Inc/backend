const express = require("express");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

app.use(express.json());
app.use("/api/v1/search", searchRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Search & Recommendation Service running on port ${PORT}`);
});
