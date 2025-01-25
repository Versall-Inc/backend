// controllers/courseController.js
const fs = require("fs");
const path = require("path");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const QuizSubmission = require("../models/QuizSubmission");
const { generateAndCreateCourse } = require("../services/courseService");

// Helper for cascade deletion
async function deleteCourseCascade(courseId) {
  // 1) remove assignment submissions and their files
  const assignments = await AssignmentSubmission.find({ courseId });
  for (let sub of assignments) {
    if (sub.fileUrl) {
      try {
        fs.unlinkSync(path.resolve(sub.fileUrl));
      } catch (err) {
        // ignore file not found
      }
    }
  }
  await AssignmentSubmission.deleteMany({ courseId });

  // 2) remove quiz submissions
  await QuizSubmission.deleteMany({ courseId });

  // 3) remove enrollments
  await Enrollment.deleteMany({ courseId });

  // 4) remove the course
  await Course.findByIdAndDelete(courseId);
}

exports.checkArchiveExpiration = async (req, res, next) => {
  const { courseId } = req.params;
  if (!courseId) return next();
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    if (course.isArchiveExpired()) {
      await deleteCourseCascade(courseId);
      return res
        .status(410)
        .json({ message: "Course was expired and has been deleted." });
    }
    req.course = course;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// CREATE course
exports.createCourse = async (req, res) => {
  try {
    // We'll pass everything from req.body, plus the user as creator
    const payload = {
      ...req.body,
      creator: req.user.id, // or from req.body if you prefer
    };
    const newCourse = await generateAndCreateCourse(payload);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET course
exports.getCourse = async (req, res) => {
  return res.json(req.course);
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  const course = req.course;
  try {
    await deleteCourseCascade(course._id);
    return res.json({ message: "Course deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ARCHIVE course
exports.archiveCourse = async (req, res) => {
  const course = req.course;
  if (course.is_archived) {
    return res.status(400).json({ error: "Course is already archived." });
  }
  course.is_archived = true;
  course.archived_at = new Date();
  await course.save();
  return res.json({ message: "Course archived successfully." });
};

// PUSH deadlines
exports.pushDeadline = async (req, res) => {
  const course = req.course;
  course.push_count += 1;
  await course.save();
  return res.json({ message: "All deadlines pushed by 10 days." });
};
