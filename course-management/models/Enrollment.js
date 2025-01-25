// models/AssignmentSubmission.js
const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  unitId: { type: mongoose.Schema.Types.ObjectId, required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileUrl: { type: String },
  status: {
    type: String,
    enum: ["not_submitted", "evaluating", "graded"],
    default: "not_submitted",
  },
  attemptNumber: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
