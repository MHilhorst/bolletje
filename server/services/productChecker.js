const fetch = require("node-fetch");
const { getStock } = require("./openApiBolServices");
const Offer = require("../models/Offer");

const saveOffer = async (offerId, offerInfo) => {
  const offerExist = await Offer.findOne({ public_offer_id: offerId }).exec();
  if (offerExist) {
  } else {
    new Offer({
      public_offer_id: offerId,
      price: offerInfo.price,
      quantity: offerInfo.quantity,
      seller_id: offerInfo.seller.id,
      seller_display_name: offerInfo.seller.displayName,
      product_id: offerInfo.product.id,
      product_ean: offerInfo.product.ean,
      product_title: offerInfo.product.title,
      product_image: offerInfo.product.images[0].url,
      created: Date.now()
    }).save();
  }
};

const analyzeStock = async (offerId, offer) => {
  const offerDoc = await Offer.findOne({ public_offer_id: offerId }).exec();
  if (offerDoc.updates.length > 0) {
    console.log("analyzing");
    const oldOfferInfo = offerDoc.updates[offerDoc.updates.length - 1];
    const newOfferInfo = {
      time_checked: Date.now(),
      quantity: offer.quantity,
      quantitySoldSincePrevious: oldOfferInfo.quantity - offer.quantity,
      price: offer.price
    };
    offerDoc.updates.push(newOfferInfo);
    offerDoc.save();
  } else {
    const update = {
      time_checked: Date.now(),
      quantity: offer.quantity,
      quantitySoldSincePrevious: 0,
      price: offer.price
    };
    offerDoc.updates.push(update);
    offerDoc.save();
  }
};

const trackNewOffer = async publicOfferId => {
  const offer = await getStock(publicOfferId, 500);
  saveOffer(publicOfferId, offer);
};

const monitor = async () => {
  setInterval(async () => {
    const offer = await getStock(1001033596665131, 500);
    analyzeStock(1001033596665131, offer);
  }, 300000);
};

module.exports = monitor;
module.exports.trackNewOffer = trackNewOffer;
