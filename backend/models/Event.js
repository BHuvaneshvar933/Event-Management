const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: String, required: true }, 
  category: { type: String, default: 'General' },
  organizerContact: { type: String, default: '' },
  registrationStartDate: { type: Date, required: true },
  registrationEndDate: { type: Date, required: true },
  status: { type: String, default: 'open' }, 
  attendees: [String] 
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
