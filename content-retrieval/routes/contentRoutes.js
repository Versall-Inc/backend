const express = require("express");
const {
  fetchYouTubeContent,
  fetchUnsplashImage,
} = require("../controllers/contentController");

const router = express.Router();

router.post("/youtube", fetchYouTubeContent);
router.post("/unsplash", fetchUnsplashImage);

module.exports = router;
