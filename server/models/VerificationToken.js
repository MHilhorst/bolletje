const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerificationTokenSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    expires: 43200,
  },
});

const VerificationToken = mongoose.model(
  'VerificationToken',
  VerificationTokenSchema
);

module.exports = VerificationToken;
