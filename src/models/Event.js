const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  platform: String,
  eventType: String,
  repository: String,
  pusher: String,
  message: String,
  status: {
    type: String,
    enum: ['triggered', 'failed', 'retrying'],
    default: 'triggered'
  },
  retries: {
    type: Number,
    default: 0
  },
  lastRetry: {
    type: Date
  },
  receivedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);