const CourseFeedback = require('../models/CourseFeedback');
const Joi = require('joi');

// Validation schema for course feedback
const courseFeedbackValidationSchema = Joi.object({
  feedbackId: Joi.string(),
  courseId: Joi.string().required(), // ID of the course the feedback is for
  rating: Joi.number().min(1).max(5).required(), // Rating between 1 and 5
  additionalFeedback: Joi.string().optional(), // Optional additional comments
});

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const validatedData = await courseFeedbackValidationSchema.validateAsync(req.body);
    const userId = req.user.id; // Assumes authentication middleware sets req.user
    const feedback = new CourseFeedback({ ...validatedData, userId });
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all feedback for a specific user
const getFeedbacks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const feedbacks = await CourseFeedback.find({ userId: req.user.id })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await CourseFeedback.findOne({ feedbackId });
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update feedback by ID
const updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await CourseFeedback.findOneAndUpdate(
      { feedbackId: req.params.feedbackId }, // Match by feedbackId
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
  try {
    const deletedFeedback = await CourseFeedback.findOneAndDelete({ feedbackId: req.params.feedbackId }); // Match by feedbackId
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};
