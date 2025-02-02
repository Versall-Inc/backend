const ReportIssue = require('../models/ReportIssue');
const Joi = require('joi');
const axios = require('axios');

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

const sendEmailNotification = async (data) => {
  try {
    // Construct a string for the email body that includes the priority and additional details.
    const emailBody = `Priority: ${data.priority}\n\nDetails:\n${JSON.stringify(data, null, 2)}`;

    // Build the email payload. The subject includes the priority,
    // and the body includes the formatted details.
    const emailPayload = {
      emails: [
        "contact@intellicourse.ca"
      ],
      subject: `Report Issue - ${data.priority}`,
      body: emailBody
    };

    // Adjust the URL based on your environment:
    // If running locally, you might use 'http://localhost:5010'
    // If running in Docker and the email service is on the host, use 'http://host.docker.internal:5010'
    // If both services are containerized with Docker Compose, use the service name.
    const response = await axios.post('http://host.docker.internal:5010/api/users/send-emails', emailPayload);
    return response.data;
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
};





// Create a new report issue
const createReportIssue = async (req, res) => {
  try {
    console.log(req.body);
    
    // Validate the incoming request body using your validation schema
    const validatedData = await reportIssueValidationSchema.validateAsync(req.body);
    const userId = req.user.id; // Assumes authentication middleware sets req.user

    // Create and save the report issue
    const reportIssue = new ReportIssue({ ...validatedData, userId });
    const savedReportIssue = await reportIssue.save();

    // Call the separate email notification function.
    // We're using req.body here since the email 'body' should be the entire request body.
    const emailResponseData = await sendEmailNotification(req.body);

    // Return both the saved report and the email response data.
    res.status(201).json({
      report: savedReportIssue,
      emailResponse: emailResponseData
    });
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
