const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const keys = require("./config/keys");
const morgan = require("morgan");
const compression = require("compression");
const PriceMonitor = require("./services/productChecker");
const OfferMonitor = require("./services/autoOfferChecker");
const PORT = process.env.PORT || 5000;

const app = express();
const server = require("http").Server(app);

PriceMonitor();
OfferMonitor();

const corsOptions = {
  optionsSuccessStatus: 200
};
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(compression());
app.use(passport.initialize());
require("./services/passport")(passport);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(keys.mongoURI, err => {
  if (err) {
    console.log(err);
  }
});
mongoose.set("useFindAndModify", false);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/bol", require("./routes/bol"));
app.use("/api/track", require("./routes/track"));
server.listen(8000, () => console.log(`Mixing it up on port ${PORT}`));
