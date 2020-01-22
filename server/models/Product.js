const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_id: {
    type: String
  },
  ean: {
    type: Number
  },
  title: {
    type: String
  },
  rating: {
    type: Number
  },
  url: {
    type: String
  },
  img: {
    type: String
  },
  offer_ids: {
    type: Array
  },
  total_sold: {
    type: Number,
    default: 0
  },
  tracking_since: {
    type: Date,
    default: Date.now()
  },
  last_offer_check: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Product', ProductSchema);
