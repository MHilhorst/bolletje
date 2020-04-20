const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new Schema({
  activated: {
    type: Boolean,
    default: false,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  address: {
    type: String,
  },
  zip: {
    type: String,
  },
  premium_account: {
    type: Boolean,
    default: false,
  },
  registration_timestamp: {
    type: Date,
    default: Date.now(),
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bol_client_id: {
    type: String,
    default: '',
  },
  bol_client_secret: {
    type: String,
    default: '',
  },
  bol_shop_name: {
    type: String,
  },
  bol_shop_id: {
    type: String,
  },
  last_update_access_token: {
    type: Date,
  },
  access_token: { type: String },
  own_offers: {
    type: Array,
  },
  status: {
    loading_export_file: { type: Boolean },
    export_file: { type: Boolean },
    export_file_time_created: { type: Date },
    // updates: { type: Array  },
    updates: { type: Array },
    default: {},
  },
  plugins: {
    type: Array,
    default: [],
  },
  bol_track_items: {
    type: Array,
    default: [],
  },
  max_track_items: {
    type: Number,
    default: 2,
  },
  tokens: {
    type: Array,
    default: [],
  },
  token: {
    type: String,
  },
  csv: {
    url: {
      type: String,
    },
    last_update: {
      type: Date,
      default: Date.now(),
    },
  },
  admin_account: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: 36000,
  });
  user.token = token;
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
