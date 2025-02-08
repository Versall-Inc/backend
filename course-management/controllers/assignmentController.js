// controllers/assignmentController.js
const Enrollment = require("../models/Enrollment");

/**
 * Controller to get a specific course's assignments.
 */
exports.getAssignments = async (req, res) => {
  const { courseId } = req.params;
  try {
    const assignmentsProgress = await Enrollment.findOne({
      course: courseId,
      userId: req.user.id,
    })
      .populate({
        path: "progress.unitsProgress.assignmentProgress",
        populate: {
          path: "assignment",
        },
      })
      .populate({
        path: "progress.unitsProgress.quizProgress",
        populate: {
          path: "quiz",
        },
      })
      .lean();

    if (!assignmentsProgress) {
      return res
        .status(404)
        .json({ error: "You are not enrolled in this course." });
    }
    if (!assignmentsProgress.progress.unitsProgress) {
      return res.json([]);
    }
    const unitsProgress = assignmentsProgress.progress.unitsProgress;
    let assignments = [];
    for (let unit of unitsProgress) {
      if (unit.assignmentProgress) {
        assignments.push(unit.assignmentProgress);
      }
      if (unit.quizProgress) {
        assignments.push(unit.quizProgress);
      }
    }
    return res.json(assignments);
  } catch (error) {
    console.error("Error in getAssignments:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAssignmentById = async (req, res) => {
  const { courseId, assignmentId } = req.params;
  try {
    const assignmentsProgress = await Enrollment.findOne({
      course: courseId,
      userId: req.user.id,
    })
      .populate({
        path: "progress.unitsProgress.assignmentProgress",
        populate: {
          path: "assignment",
        },
      })
      .lean();

    if (!assignmentsProgress) {
      return res
        .status(404)
        .json({ error: "You are not enrolled in this course." });
    }
    if (!assignmentsProgress.progress.unitsProgress) {
      return res.json([]);
    }
    const unitsProgress = assignmentsProgress.progress.unitsProgress;
    // find the assignment in the unitsProgress
    let assignment = null;
    for (let unit of unitsProgress) {
      if (unit.assignmentProgress) {
        if (
          unit.assignmentProgress.assignment._id.toString() === assignmentId
        ) {
          assignment = unit.assignmentProgress;
          break;
        }
      }
    }
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }
    return res.json(assignment);
  } catch (error) {
    console.error("Error in getAssignments:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
