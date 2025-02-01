// models/QuizSubmission.js
const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedAnswer: { type: mongoose.Schema.Types.Mixed }, // Number or Boolean
    correct: { type: Boolean, default: false },
    pointsEarned: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const quizSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Changed from ObjectId to String
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    attemptNumber: { type: Number, default: 1, min: 1 },
    answers: [userAnswerSchema],
    totalScore: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["in_progress", "submitted", "graded"],
      default: "in_progress",
    },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

// Composite Unique Index to allow multiple attempts
quizSubmissionSchema.index(
  { userId: 1, quiz: 1, attemptNumber: 1 },
  { unique: true }
);

// Indexes for performance
quizSubmissionSchema.index({ userId: 1 });
quizSubmissionSchema.index({ quiz: 1 });

module.exports = mongoose.model("QuizSubmission", quizSubmissionSchema);
