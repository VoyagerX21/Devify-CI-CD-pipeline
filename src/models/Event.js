const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: String,
  repository: String,
  pusher: String,
  message: String,
  status: {
    type: String,
    enum: ['triggered', 'failed'],
    default: 'triggered'
  },
  receivedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);