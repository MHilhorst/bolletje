const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  public_offer_id: {
    type: Number,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  seller_id: {
    type: String,
  },
  seller_display_name: {
    type: String,
  },
  seller: {
    type: Object,
  },
  product_id: {
    type: String,
  },
  product_ean: {
    type: String,
  },
  product_title: {
    type: String,
  },
  product_image: {
    type: String,
  },
  updates: {
    type: Array,
    default: null,
  },
  total_sold: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
  },
  available: {
    type: Boolean,
    default: true,
  },
  last_update: {
    type: Date,
  },
});

OfferSchema.pre('save', function (next) {
  const offer = this;
  offer.last_update = Date.now();
  next();
});

module.exports = mongoose.model('Offer', OfferSchema);
