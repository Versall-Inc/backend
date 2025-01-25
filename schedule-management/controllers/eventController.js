const Event = require('../models/Event');
const Joi = require('joi');

// Create a new event
const eventValidationSchema = Joi.object({
  userId: Joi.string().required(),
  eventId: Joi.string(),
  title: Joi.string().required(),
  type: Joi.string().required(),
  date: Joi.date().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  color: Joi.string().valid('blue', 'yellow', 'purple', 'green', 'red').required(),
  notes: Joi.string().optional(),
  repeat: Joi.string().valid('none', 'daily', 'weekly', 'monthly').default('none'),
});

// Create a new event
const createEvent = async (req, res) => {
  try {
    const validatedData = await eventValidationSchema.validateAsync(req.body);
    const event = new Event(validatedData);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events for a specific user
const getEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const events = await Event.find({ userId: req.params.userId })
    .skip((page - 1) * limit)
    .limit(limit);
     res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific event by ID
const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findOne({ eventId }); // Correct method
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update an event by ID
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { eventId: req.params.eventId }, // Match by eventId
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findOneAndDelete({ eventId: req.params.eventId }); // Match by eventId
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
