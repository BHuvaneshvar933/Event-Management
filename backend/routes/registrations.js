const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const registrations = await Registration.find({ user: username.trim().toLowerCase() });
    const populatedRegistrations = await Promise.all(
      registrations.map(async (reg) => {
        const event = await Event.findById(reg.event);
        return { registration: reg, event };
      })
    );
    res.json(populatedRegistrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Error fetching registrations' });
  }
});

router.get('/:registrationId', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    const event = await Event.findById(registration.event);
    res.json({ registration, event });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ error: 'Error fetching registration' });
  }
});

router.delete('/', async (req, res) => {
    try {
      const { eventId, user } = req.query;
      if (!eventId || !user) {
        return res.status(400).json({ error: 'eventId and user are required' });
      }
      const normalizedUser = user.trim().toLowerCase();
      const registration = await Registration.findOneAndDelete({ event: eventId, user: normalizedUser });
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.json({ message: 'Registration cancelled' });
    } catch (error) {
      console.error('Error deleting registration:', error);
      res.status(500).json({ error: 'Error deleting registration' });
    }
  });

module.exports = router;
