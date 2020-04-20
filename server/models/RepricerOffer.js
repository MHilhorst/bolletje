const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepriceOffer = new Schema({
  public_offer_id: {
    type: String,
  },
  offer_id: {
    type: String,
    default: '',
  },
  ean: {
    type: String,
  },
  user_id: {
    type: String,
  },
  stock: {
    type: Number,
  },
  delivery_code: {
    type: String,
  },
  repricer_active: {
    type: Boolean,
    default: false,
  },
  bol_active: {
    type: Boolean,
  },
  price: {
    type: Number,
  },
  total_sellers: {
    type: Number,
  },
  best_offer: {
    type: Boolean,
  },
  offers_visible: {
    type: Array,
  },
  product_title: {
    type: String,
  },
  linked_to_spreadsheet: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  product_id: {
    type: String,
  },
  last_update: {
    type: Date,
    default: Date.now(),
  },
  update_time: {
    type: Number,
    default: 10,
  },
  min_price: {
    type: Number,
  },
  updates: {
    type: Array,
    default: [],
  },
});

RepriceOffer.pre('save', function (next) {
  const repricerOffer = this;
  repricerOffer.last_update = Date.now();
  next();
});

module.exports = mongoose.model('RepricerOffer', RepriceOffer);
