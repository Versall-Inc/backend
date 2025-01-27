const mongoose = require('mongoose');

const courseFeedbackSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: String,
      default: () => new mongoose.Types.ObjectId(), // Generates a unique ObjectId for each feedback
      unique: true,
    },
    userId: {
      type: String,
      required: true, // ID of the user providing the feedback
    },
    courseId: {
      type: String,
      required: true, // ID of the course the feedback is for
    },
    rating: {
      type: Number,
      min: 1, // Minimum rating (1 star)
      max: 5, // Maximum rating (5 stars)
      required: true,
    },
    additionalFeedback: {
      type: String, // Optional field for comments/suggestions
      required: false,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('CourseFeedback', courseFeedbackSchema);
