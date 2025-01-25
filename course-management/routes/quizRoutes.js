// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const quizSubmissionController = require("../controllers/quizSubmissionController");

// Submit quiz (create submission in "in_progress" or "submitted" state)
router.post("/", quizSubmissionController.submitQuiz);

// Finalize quiz submission (evaluate it)
router.post("/finalize/:submissionId", quizSubmissionController.finalizeQuiz);

module.exports = router;
