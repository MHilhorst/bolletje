const express = require("express");
const User = require("../models/User");
const keys = require("../config/keys");
const AutoOffer = require("../models/AutoOffer");
const jwtAuth = require("express-jwt");
const {
  updatePrice,
  updateStock,
  getCommission
} = require("../services/bolServices");
const { getToken } = require("../services/accessToken");
const secret = keys.secretJWT;
const router = express.Router();

router.post("/offer", jwtAuth({ secret }), async (req, res) => {
  const offer = await AutoOffer.findOne({
    _id: req.body.autoOfferId,
    user_id: req.user._id
  }).exec();
  offer.auto_track = req.body.autoTrack;
  if (req.body.priceChangeAmount)
    offer.price_change_amount = req.body.priceChangeAmount;
  if (req.body.minListingPrice)
    offer.min_listing_price = req.body.minListingPrice;
  if (req.body.minProfit) offer.min_profit = req.body.minProfit;
  if (req.body.additionalCosts >= 0)
    offer.additional_costs = req.body.additionalCosts;
  if (req.body.priceUpdate) {
    const token = await getToken(req.user._id);
    const data = await updatePrice(
      req.body.offerId,
      req.body.priceUpdate,
      token
    );
  }
  if (req.body.stockUpdate) {
    const token = await getToken(req.user._id);
    const data = await updateStock(
      req.body.offerId,
      req.body.stockUpdate,
      token
    );
  }
  offer.save();
  console.log(offer._doc);
  res.json({ ...offer });
});

router.get("/offer/:id", jwtAuth({ secret }), async (req, res) => {
  const offer = await AutoOffer.findOne({
    _id: req.params.id,
    user_id: req.user._id
  }).exec();
  res.json({ ...offer._doc });
});

router.post("/commission", jwtAuth({ secret }), async (req, res) => {
  const token = await getToken(req.user._id);
  const commission = await getCommission(req.body.ean, req.body.price, token);
  res.json({ ...commission });
});
module.exports = router;
