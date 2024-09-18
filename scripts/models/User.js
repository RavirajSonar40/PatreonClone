const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  profilepic: String,
  coverpic:String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Add other fields as necessary
});

const User = mongoose.model('User', userSchema);

module.exports = User;
