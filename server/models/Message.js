const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user_id: {
    type: String,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Message', MessageSchema);
