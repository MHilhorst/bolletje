const User = require('../models/User');
const BolOffer = require('../models/BolOffer');
const { getToken } = require('../services/accessToken');
const { updatePrice } = require('../services/bolServices');
const { getOtherOffers } = require('../services/openApiBolServices');

const monitor = () => {
  BolOffer.find({ auto_track: true }, (err, doc) => {
    if (err) console.log(err);
    doc.map(async item => {
      const user = await User.findById(item.user_id).exec();
      const token = await getToken(user._id);
      const otherOffers = await getOtherOffers(item.ean);
      if (!otherOffers.offerData.hasOwnProperty('offers')) {
        console.log('error no offers');
      } else {
        const result = otherOffers.offerData.offers.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
        Promise.all(result).then(() => {
          if (
            result[0].seller.displayName !== user.bol_shop_name &&
            result[0].price - 0.01 > item.min_listing_price
          ) {
            const newPrice = result[0].price + 2;
            const data = updatePrice(item.offer_id, newPrice, token);
          }
          if (result[0].seller.displayName === user.bol_shop_name) {
            const secondPrice = result[1].price;
            const newPrice = result[1].price - 0.01;
          }
        });
      }
    });
  });
};

module.exports = monitor;
