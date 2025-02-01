// models/AssignmentSubmission.js
const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Changed from ObjectId to String
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    fileUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+\.(pdf|docx?|pptx?)$/,
        "Please enter a valid file URL.",
      ],
    },
    status: {
      type: String,
      enum: ["not_submitted", "evaluating", "graded"],
      default: "not_submitted",
    },
    attemptNumber: { type: Number, default: 1, min: 1 },
    grade: { type: Number, min: 0 },
    feedback: { type: String },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

// Composite Unique Index to allow multiple submissions based on attemptNumber
assignmentSubmissionSchema.index(
  { userId: 1, assignment: 1, attemptNumber: 1 },
  { unique: true }
);

// Indexes for performance
assignmentSubmissionSchema.index({ userId: 1 });
assignmentSubmissionSchema.index({ assignment: 1 });

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
