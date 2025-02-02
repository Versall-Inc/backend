// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");
const { checkArchiveExpiration } = require("../middlewares/coursesMiddlewares");

// Complete toggle a chapter
router.put(
  "/:courseId/:chapterId",
  checkArchiveExpiration,
  chapterController.toggleChapterComplete
);

module.exports = router;
