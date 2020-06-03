const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WooCommerceConnectionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  consumer_key: { type: String },
  consumer_secret: { type: String },
  version: { type: String },
  created: { type: Date, default: Date.now() },
  url: { type: String },
});

const WooCommerceConnection = mongoose.model(
  'WooCommerceConnection',
  WooCommerceConnectionSchema
);

module.exports = WooCommerceConnection;
