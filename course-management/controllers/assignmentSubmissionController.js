// controllers/assignmentSubmissionController.js
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.submitAssignment = async (req, res) => {
  try {
    const { courseId, unitId, chapterId } = req.body;
    const userId = req.user.id;

    // Ensure user is enrolled
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "User is not enrolled in this course." });
    }
    // Check course structure
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found." });
    const unit = course.units.id(unitId);
    if (!unit) return res.status(404).json({ error: "Unit not found." });
    // If the course assignment_types doesn't include 'writing' or 'presentation', etc.,
    // you could check here.

    // Check last submission attempt
    const lastSub = await AssignmentSubmission.findOne({
      userId,
      courseId,
      unitId,
      chapterId,
    }).sort({ attemptNumber: -1 });
    if (lastSub && lastSub.status === "evaluating") {
      return res.status(400).json({
        error: "Cannot resubmit while last submission is still evaluating.",
      });
    }
    const attemptNumber = lastSub ? lastSub.attemptNumber + 1 : 1;

    // Multer file
    const fileUrl = req.file ? req.file.path : null;

    const submission = new AssignmentSubmission({
      userId,
      courseId,
      unitId,
      chapterId,
      fileUrl,
      status: "evaluating",
      attemptNumber,
    });
    await submission.save();

    return res
      .status(201)
      .json({ message: "Assignment submitted successfully.", submission });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
