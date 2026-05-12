const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  email: {
    type: String,
    required: false,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
  },
  busNumber: {
    type: String,
    required: false,
  },
  route: {
    type: String,
    required: false,
  },
  emailAlerts: {
    type: Boolean,
    default: true
  },
  whatsappAlerts: {
    type: Boolean,
    default: true
  },
  smsAlerts: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alert', alertSchema);
