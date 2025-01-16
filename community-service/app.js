require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const channelRoutes = require("./routes/channelRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userMiddleware = require("./middlewares/userMiddleware");

const app = express();
app.use(express.json());

// ------------------- MIDDLEWARES -------------------
app.use(userMiddleware);

// ------------------- ROUTES -------------------
app.use("/channels", channelRoutes);
app.use("/posts", postRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);

// Sync DB and start server
const PORT = process.env.PORT || 3000;
sequelize
  .sync({ force: false }) // set to true to drop & re-create tables
  .then(() => {
    console.log("Database synced!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
