const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_id: {
    type: String,
  },
  ean: {
    type: Number,
  },
  title: {
    type: String,
  },
  rating: {
    type: Number,
  },
  url: {
    type: String,
  },
  img: {
    type: String,
  },
  offer_ids: {
    type: Array,
  },
  total_sold: {
    type: Number,
    default: 0,
  },
  tracking_since: {
    type: Date,
    default: Date.now(),
  },
  last_offer_check: {
    type: Date,
    default: Date.now(),
  },
  active_offers: {
    type: Array,
    default: [],
  },
  last_old_offer_wipe: {
    type: Date,
    default: Date.now(),
  },
  last_product_check: {
    type: Date,
    default: Date.now(),
  },
  users_tracking: {
    type: Array,
    default: [],
  },
});

// ProductSchema.pre('remove', function(next){
//   this.model('User').find( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } } )
// })
//https://stackoverflow.com/questions/14763721/mongoose-delete-array-element-in-document-and-save

// ProductSchema.pre('remove', async function (next) {
//   const product = this;
//   console.log('deleting');
//   const users = await User.findOne({ bol_track_items: product }).exec();
//   console.log(users);
//   next();
// });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
