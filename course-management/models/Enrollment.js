// models/Enrollment.js
const mongoose = require("mongoose");

// Subschemas for progress tracking

const chapterProgressSchema = new mongoose.Schema(
  {
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const assignmentProgressSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    submitted: { type: Boolean, default: false },
    submissionDate: { type: Date },
    grade: { type: Number, min: 0 },
    feedback: { type: String },
  },
  { _id: false }
);

const quizProgressSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, min: 0 },
    attempts: { type: Number, default: 0, min: 0 },
    lastAttempted: { type: Date },
  },
  { _id: false }
);

const unitProgressSchema = new mongoose.Schema(
  {
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    completed: { type: Boolean, default: false },
    chaptersProgress: [chapterProgressSchema],
    assignmentProgress: assignmentProgressSchema,
    quizProgress: quizProgressSchema,
  },
  { _id: false }
);

// Main Enrollment Schema

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // User ID from external microservice
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false }, // Archive-specific field
    archivedAt: { type: Date }, // Archive-specific field
    progress: {
      overallProgress: { type: Number, default: 0, min: 0, max: 100 },
      startedAt: { type: Date, default: Date.now },
      completedAt: { type: Date },
      unitsProgress: [unitProgressSchema],
    },
  },
  { timestamps: true }
);

// Composite Unique Index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, course: 1 }, { unique: true });

// Indexes for performance
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ userId: 1 });

enrollmentSchema.methods.calculateOverallProgress = function () {
  const { unitsProgress } = this.progress;
  let totalItems = 0;
  let completedItems = 0;

  unitsProgress.forEach((unit) => {
    // Chapters
    if (unit.chaptersProgress.length > 0) {
      totalItems += unit.chaptersProgress.length;
      completedItems += unit.chaptersProgress.filter(
        (ch) => ch.completed
      ).length;
    }

    // Assignments
    if (unit.assignmentsProgress.length > 0) {
      totalItems += unit.assignmentsProgress.length;
      completedItems += unit.assignmentsProgress.filter(
        (asn) => asn.submitted
      ).length;
    }

    // Quizzes
    if (unit.quizzesProgress.length > 0) {
      totalItems += unit.quizzesProgress.length;
      completedItems += unit.quizzesProgress.filter(
        (qz) => qz.completed
      ).length;
    }
  });

  if (totalItems === 0) {
    this.progress.overallProgress = 0;
  } else {
    const progress = (completedItems / totalItems) * 100;
    this.progress.overallProgress = Math.min(progress, 100);
  }

  if (this.progress.overallProgress === 100 && !this.progress.completedAt) {
    this.progress.completedAt = new Date();
  } else if (this.progress.overallProgress < 100 && this.progress.completedAt) {
    this.progress.completedAt = undefined;
  }
};

module.exports = mongoose.model("Enrollment", enrollmentSchema);
