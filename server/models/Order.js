const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user_id: {
    type: String,
  },
  order_id: {
    type: String,
    unique: true,
    required: true,
  },
  platform: {
    type: String,
  },
  status: {
    type: String,
    default: 'OPEN',
  },
  order_date: {
    type: String,
  },
  customer_details: {
    type: Object,
  },
  order_items: {
    type: Array,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
