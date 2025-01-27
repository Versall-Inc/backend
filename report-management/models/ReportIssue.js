const mongoose = require('mongoose');

const reportIssueSchema = new mongoose.Schema(
  {
    issueId: {
      type: String, 
      default: () => new mongoose.Types.ObjectId(), // Generates a unique ObjectId for each report
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      enum: [
        'Functionality Issue', 
        'Content Issue', 
        'Design Issue', 
        'Other', 
        'Unrelated Course Material', 
        'Performance Issue', 
        'Usability/UX Issue',
      ],
      required: true,
    },
    details: {
      type: String,
      required: true, // Detailed description of the issue
    },
    priority: {
      type: String,
      enum: ['High Priority', 'Medium Priority', 'Low Priority'],
      default: 'Medium Priority',
    },
    attachments: [
      {
        type: String, // File paths or URLs for attachments
      },
    ],
    additionalInfo: {
      type: String, // Any additional information provided
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('ReportIssue', reportIssueSchema);
