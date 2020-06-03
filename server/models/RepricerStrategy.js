const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepricerStrategySchema = new Schema({
  user_id: {
    type: String,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  marketplace: {
    type: String,
    default: 'bol.com',
  },
  strategy_name: {
    type: String,
  },
  datafeed_url: {
    type: String,
  },
  // Buy Box Targeting, Lowest Price , Custom Strategy
  strategy_type: {
    type: String,
  },
  compete_with_bol: {
    type: Boolean,
  },
  price_increment: {
    type: Number,
  },
  price_increment_type: {
    type: String,
  },
  increment_type: {
    type: String,
  },
  buy_box_price_action: {
    increment_type: { type: String },
    increment_operator: { type: String },
    pricing_increment_type: { type: String },
    pricing_increment: { type: Number },
  },
  minimum_pricing: {
    percentage: { type: Number },
    pricing_type: { type: String },
  },
  no_competition: {
    type: String,
  },
  compete_with_bol: {
    type: Boolean,
  },
  competition_below_min_price: {
    type: String,
  },
  competition_match_min_price: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  raise_price_when_buy_box: {
    type: Boolean,
  },
  pricing: {
    automatic: { type: Boolean },
    method: { type: String },
    minimum: { type: Number },
    maximum: { type: Number },
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('RepricerStrategy', RepricerStrategySchema);
