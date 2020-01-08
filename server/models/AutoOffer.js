const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoOfferSchema = new Schema({
  offer_id: {
    type: String
  },
  auto_track: {
    type: Boolean,
    default: false
  },
  min_profit: {
    type: Number
  },
  min_listing_price: {
    type: Number
  },
  additional_costs: {
    type: Number
  },
  user_id: {
    type: String
  },
  ean: {
    type: String
  }
});

module.exports = mongoose.model('AutoOffer', AutoOfferSchema);
