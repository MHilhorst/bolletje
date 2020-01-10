const User = require("../models/User");
const AutoOffer = require("../models/AutoOffer");
const { getToken } = require("../services/accessToken");
const { getOffer } = require("../services/bolServices");
const { getOtherOffers } = require("../services/openApiBolServices");
const monitor = () => {
  AutoOffer.find({ auto_track: true }, (err, doc) => {
    if (err) console.log(err);
    doc.map(async item => {
      console.log(item.min_listing_price);
      const user = await User.findById(item.user_id).exec();
      const token = await getToken(user._id);
      const offer = await getOffer(token, item.offer_id);
      const currentPrice = offer.pricing.bundlePrices[0];
      const otherOffers = await getOtherOffers(item.ean);
      let lowestOfferPrice = false;
      let changePrice = false;
      const result = otherOffers.offerData.offers.map(otherOfferEntity => {
        if (currentPrice.price < otherOfferEntity.price)
          lowestOfferPrice = true;
        if (
          currentPrice.price > otherOfferEntity.price &&
          otherOfferEntity.price > item.min_listing_price
        )
          changePrice = true;
      });
      Promise.all(result).then(completed => {
        console.log(lowestOfferPrice, changePrice);
      });
    });
  });
};

module.exports = monitor;
