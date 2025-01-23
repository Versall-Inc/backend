const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String, 
      default: uuidv4, 
      unique: true, 
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    color: {
      type: String,
      enum: ['blue', 'yellow', 'purple', 'green', 'red'],
      required: true,
    },
    notes: {
      type: String,
    },
    repeat: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },
  },
  { timestamps: true }
);


// Export the model
module.exports = mongoose.model('Event', eventSchema);
