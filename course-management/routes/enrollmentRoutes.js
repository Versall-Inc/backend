// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");

// Enroll
router.post("/", enrollmentController.enrollUser);

// View content
router.get("/:courseId/content", enrollmentController.getCourseContent);

module.exports = router;
