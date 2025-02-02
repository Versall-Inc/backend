// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    isPublic: { type: Boolean, default: true },
    creatorId: { type: String, required: true }, // Changed from ObjectId to String
    usersCanModerate: { type: Boolean, default: false },
    materialTypes: [{ type: String, enum: ["reading", "video"] }],
    assignmentTypes: [
      { type: String, enum: ["writing", "presentation", "quiz"] },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    overview: { type: String },
    prompt: { type: String },
    category: { type: String },
    subcategory: { type: String },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    participants: [{ type: String }], // Array of userIds as strings
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
    courseObjectives: { type: String },
    generated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual to get total units
courseSchema.virtual("totalUnits").get(function () {
  return this.units.length;
});

// total chapters
courseSchema.virtual("totalChapters").get(function () {
  return this.units.reduce((acc, unit) => acc + unit.chapters.length, 0);
});

// total quizzes
courseSchema.virtual("totalQuizzes").get(function () {
  return this.units.reduce(
    (acc, unit) =>
      acc +
      unit.chapters.reduce((acc, chapter) => acc + (chapter.quiz ? 1 : 0), 0),
    0
  );
});

// Ensure virtual fields are serialized
courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Course", courseSchema);
