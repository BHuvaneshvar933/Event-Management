
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
  user: { type: String, required: true }, 
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  qrCodeData: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
