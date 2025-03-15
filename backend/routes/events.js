const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const QRCode = require('qrcode');
const Registration = require('../models/Registration');

// -------------------------
// Create a New Event (Public)
// Expects in the body: title, description, date, location, organizer (username), category, organizerContact, registrationStartDate, registrationEndDate
// -------------------------
router.post('/', async (req, res) => {
  try {
    const { title, description, date, location, organizer, category, organizerContact, registrationStartDate, registrationEndDate } = req.body;
    if (!organizer) return res.status(400).json({ error: 'Organizer is required' });
    const normalizedOrganizer = organizer.trim().toLowerCase();
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      organizer: normalizedOrganizer,
      category: category || 'General',
      organizerContact: organizerContact || '',
      registrationStartDate,
      registrationEndDate,
      status: 'open',
      attendees: []
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
});

// -------------------------
// Get Organized Events for a Specific User (Public)
// Expects a query parameter: ?username=user1
// -------------------------
router.get('/mine', async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    console.log("Fetching organized events for username:", username);
    const events = await Event.find({ organizer: username.trim().toLowerCase() });
    res.json(events);
  } catch (error) {
    console.error('Error fetching organized events:', error);
    res.status(500).json({ error: 'Error fetching organized events' });
  }
});

// -------------------------
// Get Registered Events for a Specific User (Public)
// Expects a query parameter: ?username=user1
// -------------------------
router.get('/registered', async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    console.log("Fetching registered events for username:", username);
    const events = await Event.find({ attendees: username.trim().toLowerCase() });
    res.json(events);
  } catch (error) {
    console.error('Error fetching registered events:', error);
    res.status(500).json({ error: 'Error fetching registered events' });
  }
});

// -------------------------
// Get All Events (Public)
// -------------------------
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// -------------------------
// Get Event Details (Public)
// Must be defined after the above static routes so that "/mine" or "/registered" are not misinterpreted.
// -------------------------
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ error: 'Error fetching event details' });
  }
});

// -------------------------
// Update Event Details (Organiser Only)
// Expects in the body: organizer (must match event.organizer) plus any fields to update.
// Now includes "attendees" in allowedUpdates so that when an attendee is removed, the update works.
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const { organizer } = req.body;
    if (!organizer || organizer.trim().toLowerCase() !== event.organizer) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }
    const allowedUpdates = ['title', 'description', 'date', 'location', 'category', 'organizerContact', 'registrationStartDate', 'registrationEndDate', 'attendees'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });
    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Error updating event' });
  }
});

// -------------------------
// Close Event (Organiser Only)
// Expects in the body: organizer (must match event.organizer)
router.put('/:id/close', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const { organizer } = req.body;
    if (!organizer || organizer.trim().toLowerCase() !== event.organizer) {
      return res.status(403).json({ error: 'Not authorized to close this event' });
    }
    event.status = 'closed';
    await event.save();
    res.json({ message: 'Event closed successfully' });
  } catch (error) {
    console.error('Error closing event:', error);
    res.status(500).json({ error: 'Error closing event' });
  }
});

// -------------------------
// Delete Event (Organiser Only)
// Expects in the body: organizer (must match event.organizer)
router.delete('/:id', async (req, res) => {
  try {
    console.log('Received DELETE request for event:', req.params.id);
    console.log('Request body:', req.body);

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Ensure request body contains the organizer
    const { organizer } = req.body;
    if (!organizer || organizer.toLowerCase().trim() !== event.organizer.toLowerCase().trim()) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error); // This should show the actual issue
    res.status(500).json({ error: 'Internal server error' });
  }
});


// -------------------------
// Register for an Event (Participant)
// Expects in the body: participant (username), relation ("participant"), and email.
// Also checks that the current date is within registrationStartDate and registrationEndDate and that event.status is 'open'.

router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const now = new Date();
    if (
      now < new Date(event.registrationStartDate) ||
      now > new Date(event.registrationEndDate) ||
      event.status !== 'open'
    ) {
      return res.status(400).json({ error: 'Registrations closed' });
    }

    // Expect these fields in the body
    let { participant, relation, email, fullName, phone } = req.body;
    if (!participant || relation !== 'participant' || !email || !fullName || !phone) {
      return res.status(400).json({ error: 'Invalid registration data' });
    }
    // Normalize participant username for consistency
    participant = participant.trim().toLowerCase();

    // Prevent duplicate registration
    if (event.attendees.includes(participant)) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    event.attendees.push(participant);
    await event.save();

    const registrationCode = `${participant}-${event._id}-${Date.now()}`;
    const qrCodeDataUrl = await QRCode.toDataURL(registrationCode);

    // Create a new registration record including fullName and phone
    const registration = new Registration({
      user: participant,
      event: event._id,
      qrCodeData: qrCodeDataUrl,
      fullName,
      phone
    });
    await registration.save();

    res.json({ message: 'Registration successful', registrationId: registration._id, qrCode: qrCodeDataUrl });
  } catch (error) {
    console.error('Error during event registration:', error);
    res.status(500).json({ error: 'Error during event registration' });
  }
});


module.exports = router;
