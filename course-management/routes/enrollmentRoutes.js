// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");

// Enroll
router.post("/:courseId", enrollmentController.enrollUser);

// Unenroll
router.delete("/:courseId", enrollmentController.unEnrollUser);

module.exports = router;
