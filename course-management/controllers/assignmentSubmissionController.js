// controllers/assignmentSubmissionController.js
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { assessWritingAssignment } = require("../services/assignmentService");
const fs = require("fs");

const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    fs.unlinkSync(fileUrl);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

exports.submitAssignment = async (req, res) => {
  const fileUrl = req.file ? req.file.path : null;
  if (!fileUrl) {
    deleteFile(fileUrl);
    return res.status(400).json({ error: "File upload required." });
  }
  try {
    const { courseId, assignmentId } = req.params;
    const userId = req.user.id;

    // Ensure user is enrolled
    const enrollment = await Enrollment.findOne({
      userId,
      course: courseId,
    }).populate({
      path: "progress.unitsProgress.assignmentProgress",
      populate: {
        path: "assignment",
      },
    });
    if (!enrollment) {
      deleteFile(fileUrl);
      return res
        .status(403)
        .json({ error: "User is not enrolled in this course." });
    }
    const unitsProgress = enrollment.progress.unitsProgress;
    // find assignmentProgress
    const unitProgress = unitsProgress.find(
      (unit) =>
        unit.assignmentProgress &&
        unit.assignmentProgress.assignment._id.toString() === assignmentId
    );
    const assignmentProgress = unitProgress.assignmentProgress;
    if (!assignmentProgress) {
      deleteFile(fileUrl);
      return res.status(404).json({ error: "Assignment not found." });
    }
    assignmentProgress.fileUrl = fileUrl;
    assignmentProgress.submitted = true;
    assignmentProgress.submissionDate = new Date();
    assignmentProgress.attempts += 1;

    // Call the grading service
    const assignmentOverview = assignmentProgress.assignment.overview;
    const gradeResult = await assessWritingAssignment(
      assignmentOverview,
      req.file
    );
    assignmentProgress.grade = gradeResult.grade;
    assignmentProgress.feedback = gradeResult.feedback;

    enrollment.calculateOverallProgress();
    await enrollment.save();
    return res.status(201).json({
      message: "Assignment submitted successfully.",
      assignmentProgress,
    });
  } catch (error) {
    deleteFile(fileUrl);
    return res.status(500).json({ error: error.message });
  }
};
