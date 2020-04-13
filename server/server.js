require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
const compression = require('compression');
const auth = require('./services/authMiddleware');
const adminAuth = require('./services/adminAuthMiddleware');

const app = express();
const server = require('http').Server(app);

const assignId = (req, res, next) => {
  req.id = uuid.v4();
  next();
};

const corsOptions = {
  optionsSuccessStatus: 200,
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
// app.use(assignId);
app.use(morgan('dev'));
app.use(morgan('common', { stream: accessLogStream }));
app.use(cors(corsOptions));
app.use(compression());
app.use(passport.initialize());
require('./services/passport')(passport);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to Mongoose');
    }
  }
);

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log(user);

  done(null, user);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', auth, require('./routes/user'));
app.use('/api/bol', auth, require('./routes/bol'));
app.use('/api/admin', adminAuth, require('./routes/admin'));
app.use('/api/track', require('./routes/track'));
app.use('/api/order', require('./routes/order'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/plugin/aliexpress', require('./routes/plugin-aliexpress'));
server.listen(8000, () => {});
