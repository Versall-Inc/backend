const mongoose = require('mongoose');

// Schema for user profile (simplified)
const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  expertise: [String],  // User expertise/topics of interest
  history: [{ courseId: String, completed: Boolean }]  // Courses the user has taken
});

const userProfileModel = mongoose.model('UserProfile', userProfileSchema);
module.exports = userProfileModel;
