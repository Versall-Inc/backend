const express = require('express');
const {
  createReportIssue,
  getReportIssues,
  getReportIssueById,
  updateReportIssue,
  deleteReportIssue,
} = require('../controllers/reportIssueController');

const router = express.Router();

// Route to create a new report issue
router.post('/', createReportIssue);

// Route to get all report issues for a specific user
router.get('/user/', getReportIssues);

// Route to get a specific report issue by ID
router.get('/:issueId', getReportIssueById);

// Route to update a report issue by ID
router.put('/:issueId', updateReportIssue);

// Route to delete a report issue by ID
router.delete('/:issueId', deleteReportIssue);

module.exports = router;
