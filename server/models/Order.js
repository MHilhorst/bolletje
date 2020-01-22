const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user_id: {
    type: String
  },
  order_id: {
    type: String
  },
  platform: {
    type: String
  },
  status: {
    type: String,
    default: 'OPEN'
  },
  registration_timestamp: {
    type: Date,
    default: Date.now()
  },
  order_date: {
    type: String
  },
  customer_details: {
    type: Object
  },
  order_items: {
    type: Array
  }
});

module.exports = mongoose.model('Order', OrderSchema);
