const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  activated: {
    type: Boolean,
    default: false
  },
  registration_timestamp: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  bol_client_id: {
    type: String
  },
  bol_client_secret: {
    type: String
  },
  bol_shop_name: {
    type: String
  },
  bol_shop_id: {
    type: String
  },
  last_update_access_token: {
    type: Date
  },
  access_token: { type: String },
  own_offers: {
    type: Array
  }
});

module.exports = mongoose.model("User", UserSchema);
