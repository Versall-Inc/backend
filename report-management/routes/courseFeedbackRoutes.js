const express = require('express');
const {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/courseFeedbackController');

const router = express.Router();

// Route to create new feedback
router.post('/', createFeedback);

// Route to get all feedback for a specific user
router.get('/user/', getFeedbacks);

// Route to get a specific feedback by ID
router.get('/:feedbackId', getFeedbackById);

// Route to update a feedback by ID
router.put('/:feedbackId', updateFeedback);

// Route to delete a feedback by ID
router.delete('/:feedbackId', deleteFeedback);

module.exports = router;
