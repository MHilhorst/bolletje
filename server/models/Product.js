const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_id: {
    type: Number
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
  }
});

module.exports = mongoose.model("Product", ProductSchema);
