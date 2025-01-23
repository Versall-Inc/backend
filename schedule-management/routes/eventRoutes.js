const express = require('express');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const router = express.Router();

// Route to create a new event
router.post('/', createEvent);

// Route to get all events for a specific user
router.get('/user/:userId', getEvents);

// Route to get a specific event by ID
router.get('/:eventId', getEventById);

// Route to update an event by ID
router.put('/:eventId', updateEvent);

// Route to delete an event by ID
router.delete('/:eventId', deleteEvent);

module.exports = router;
    