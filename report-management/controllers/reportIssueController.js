const ReportIssue = require('../models/ReportIssue');
const Joi = require('joi');

// Validation schema for report issues
const reportIssueValidationSchema = Joi.object({
  issueId: Joi.string(),
  reason: Joi.string()
    .valid(
      'Functionality Issue',
      'Content Issue',
      'Design Issue',
      'Other',
      'Unrelated Course Material',
      'Performance Issue',
      'Usability/UX Issue'
    )
    .required(),
  details: Joi.string().required(),
  priority: Joi.string()
    .valid('High Priority', 'Medium Priority', 'Low Priority')
    .default('Medium Priority'),
  attachments: Joi.array().items(Joi.string()).optional(), // Array of file paths or URLs
  additionalInfo: Joi.string().optional(),
});

// Create a new report issue
const createReportIssue = async (req, res) => {
  try {
    const validatedData = await reportIssueValidationSchema.validateAsync(req.body);
    const userId = req.user.id; // Assumes authentication middleware sets req.user
    const reportIssue = new ReportIssue({ ...validatedData, userId });
    const savedReportIssue = await reportIssue.save();
    res.status(201).json(savedReportIssue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all report issues for a specific user
const getReportIssues = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const reportIssues = await ReportIssue.find({ userId: req.user.id })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json(reportIssues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific report issue by ID
const getReportIssueById = async (req, res) => {
  const { issueId } = req.params;
  try {
    const reportIssue = await ReportIssue.findOne({ issueId }); // Match by issueId
    if (!reportIssue) {
      return res.status(404).json({ error: 'Report Issue not found' });
    }
    res.status(200).json(reportIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a report issue by ID
const updateReportIssue = async (req, res) => {
  try {
    const updatedReportIssue = await ReportIssue.findOneAndUpdate(
      { issueId: req.params.issueId }, // Match by issueId
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReportIssue) {
      return res.status(404).json({ error: 'Report Issue not found' });
    }
    res.status(200).json(updatedReportIssue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a report issue by ID
const deleteReportIssue = async (req, res) => {
  try {
    const deletedReportIssue = await ReportIssue.findOneAndDelete({ issueId: req.params.issueId }); // Match by issueId
    if (!deletedReportIssue) {
      return res.status(404).json({ error: 'Report Issue not found' });
    }
    res.status(200).json({ message: 'Report Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReportIssue,
  getReportIssues,
  getReportIssueById,
  updateReportIssue,
  deleteReportIssue,
};
