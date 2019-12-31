const fetch = require('node-fetch');
const { getStock, getPriceOneItem } = require('./openApiBolServices');
const Offer = require('../models/Offer');
const Product = require('../models/Product');

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

const analyzeStock = async (offerId, offer, priceOneUnit) => {
  const offerDoc = await Offer.findOne({ public_offer_id: offerId }).exec();
  const productDoc = await Product.findOne({
    product_id: offer.product.id
  }).exec();
  if (offerDoc.updates.length > 0) {
    console.log('analyzing');
    const oldOfferInfo = offerDoc.updates[offerDoc.updates.length - 1];
    const newOfferInfo = {
      time_checked: Date.now(),
      quantity: offer.quantity,
      quantitySoldSincePrevious: oldOfferInfo.quantity - offer.quantity,
      price: priceOneUnit
    };
    offerDoc.updates.push(newOfferInfo);
    if (newOfferInfo.quantitySoldSincePrevious > 0) {
      offerDoc.total_sold =
        (offerDoc.total_sold || 0) + newOfferInfo.quantitySoldSincePrevious;
      productDoc.total_sold =
        (productDoc.total_sold || 0) + newOfferInfo.quantitySoldSincePrevious;
    }
    offerDoc.quantity = offer.quantity;
    offerDoc.price = priceOneUnit;
    offerDoc.save();
    productDoc.save();
  } else {
    const update = {
      time_checked: Date.now(),
      quantity: offer.quantity,
      quantitySoldSincePrevious: 0,
      price: priceOneUnit
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
    const priceOneUnit = await getPriceOneItem(1001033596665131);
    analyzeStock(1001033596665131, offer, priceOneUnit);
  }, 30000);
};

module.exports = monitor;
module.exports.trackNewOffer = trackNewOffer;
