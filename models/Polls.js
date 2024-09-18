// models/Poll.js
const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  votes: {
    type: [Number],
    default: [0, 0, 0, 0]
  },
  creatorName: {
    type: String,
    required: true
  },
  creatorProfile: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Poll', PollSchema);
