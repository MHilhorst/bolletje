const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  public_offer_id: {
    type: Number
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  seller_id: {
    type: String
  },
  seller_display_name: {
    type: String
  },
  product_id: {
    type: String
  },
  product_ean: {
    type: String
  },
  product_title: {
    type: String
  },
  product_image: {
    type: String
  },
  updates: {
    type: Array
  },
  total_sold: {
    type: Number
  },
  created: {
    type: Date
  },
  last_update: {
    tupe: Date
  }
});

module.exports = mongoose.model('Offer', OfferSchema);
