const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BolOfferSchema = new Schema({
  offer_id: {
    type: String
  },
  product_name: {
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
  price_change_amount: {
    type: Number
  },
  user_id: {
    type: String
  },
  ean: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  total_sold: {
    type: Number,
    default: 0
  },
  linked_to_inventory_item: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('BolOffer', BolOfferSchema);
