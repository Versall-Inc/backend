// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const quizSubmissionController = require("../controllers/quizSubmissionController");

// Submit quiz (create submission in "in_progress" or "submitted" state)
router.post("/", quizSubmissionController.submitQuiz);

router.get("/get/:courseId/:quizId", quizSubmissionController.getQuiz);

module.exports = router;
