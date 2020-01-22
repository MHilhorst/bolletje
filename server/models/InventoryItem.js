const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventoryItemSchema = new Schema({
  user_id: {
    type: String
  },
  product_name: {
    type: String
  },
  stock: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  registration_timestamp: {
    type: Date,
    default: Date.now()
  },
  platform_available: {
    type: Array,
    default: []
  },
  bol_id: {
    type: String
  },
  total_sold: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
