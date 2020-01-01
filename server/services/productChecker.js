const fetch = require("node-fetch");
const { getStock, getPriceOneItem } = require("./openApiBolServices");
const Offer = require("../models/Offer");
const Product = require("../models/Product");

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
    const oldOfferInfo = offerDoc.updates[offerDoc.updates.length - 1];
    const sold =
      oldOfferInfo.quantity - offer.quantity > 0
        ? oldOfferInfo.quantity - offer.quantity
        : 0;
    const newOfferInfo = {
      time_checked: Date.now(),
      quantity: offer.quantity,
      quantitySoldSincePrevious: sold,
      price: priceOneUnit
    };
    offerDoc.updates.push(newOfferInfo);
    if (sold > 0) {
      offerDoc.total_sold = (offerDoc.total_sold || 0) + sold;
      productDoc.total_sold = (productDoc.total_sold || 0) + sold;
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

const getProductsToMonitor = async () => {
  const products = Product.find({}).exec();
  return products;
};

const monitor = async () => {
  setInterval(async () => {
    const products = await getProductsToMonitor();
    products.map(async product => {
      product.offer_ids.map(async offerItem => {
        const offer = await getStock(offerItem.id, 500);
        const priceOneUnit = await getPriceOneItem(offerItem.id);
        analyzeStock(offerItem.id, offer, priceOneUnit);
      });
    });
  }, 3600000);
};

module.exports = monitor;
module.exports.trackNewOffer = trackNewOffer;
