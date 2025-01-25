// models/Course.js
const mongoose = require("mongoose");

// QUESTION schema
const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["multiple_choice", "true_false", "short_answer", "essay"],
    required: true,
  },
  question: { type: String, required: true },
  options: [{ type: String }], // for multiple_choice / true_false
  correct_answer: { type: Number }, // index in 'options', or 0/1 for T/F
  explanation: { type: String },
  points: { type: Number, default: 1 },
});

// QUIZ schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  due_date: { type: Date },
  questions: [questionSchema],
  overview: { type: String },
  total_points: { type: Number, default: 0 },
});

// ASSIGNMENT schema
const assignmentSchema = new mongoose.Schema({
  overview: { type: String },
  due_date: { type: Date },
  title: { type: String },
  assignment_type: {
    type: String,
    enum: ["writing", "presentation"],
    required: true,
  },
});

// CHAPTER schema
const chapterSchema = new mongoose.Schema({
  youtube_query: { type: String },
  youtube_link: { type: String },
  content: { type: String },
  completed: { type: Boolean, default: false },
  title: { type: String },
});

// UNIT schema
const unitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  chapters: [chapterSchema],

  // assignment & quiz are optional depending on course.assignment_types
  assignment: assignmentSchema,
  quiz: quizSchema,
});

// COURSE schema
const courseSchema = new mongoose.Schema(
  {
    is_public: { type: Boolean, default: false },
    is_archived: { type: Boolean, default: false },
    creator: { type: String, required: true },
    users_can_moderate: { type: Boolean, default: false },
    material_types: [{ type: String, enum: ["reading", "video"] }],
    assignment_types: [
      { type: String, enum: ["writing", "presentation", "quiz"] },
    ],
    title: { type: String, required: true },
    overview: { type: String },
    prompt: { type: String },
    category: { type: String },
    subcategory: { type: String },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    participants: [{ type: String }], // user IDs
    units: [unitSchema],
    archived_at: { type: Date },
    push_count: { type: Number, default: 0 },
    course_objectives: { type: String },
  },
  { timestamps: true }
);

// Check if archived > 30 days
courseSchema.methods.isArchiveExpired = function () {
  if (!this.is_archived || !this.archived_at) return false;
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
  return Date.now() - this.archived_at.getTime() > THIRTY_DAYS;
};

module.exports = mongoose.model("Course", courseSchema);
