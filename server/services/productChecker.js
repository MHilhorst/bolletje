const Offer = require('../models/Offer');
const {
  getStock,
  getPriceOneItem,
  updateProductOffers,
  showTotalCalls,
} = require('./openApiBolServices');
const Product = require('../models/Product');
const CronJob = require('cron').CronJob;

const trackNewOffer = async (publicOfferId) => {
  const offer = await getStock(publicOfferId, 500);
  saveOffer(publicOfferId, offer);
};

// Add feature to filter which products get chosen to be monitored in a lapse to prevent all products from being monitored in 1 lap/
const getProductsToMonitor = async (productId) => {
  let yesterday = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
  let test = new Date(new Date().getTime() - 60 * 30 * 1000);
  if (productId) {
    const product = Product.find({ product_id: productId });
    return product;
  } else {
    const products = Product.find({
      last_offer_check: { $lte: test },
    })
      .sort({ last_offer_check: 1 })
      .limit(10)
      .exec();
    return products;
  }
};

const saveOffer = async (offerId, offerInfo) => {
  const offerExist = await Offer.findOne({ public_offer_id: offerId }).exec();
  if (offerExist) {
    offerExist.price = offerInfo.price;
    offerExist.quantity = offerInfo.quantity;
    offerExist.seller_id = offerInfo.seller.id;
    offerExist.seller_display_name = offerInfo.seller.displayName;
    offerExist.seller = offerInfo.seller;
    offerExist.product_id = offerInfo.product.id;
    offerExist.product_ean = offerInfo.product.ean;
    offerExist.product_title = offerInfo.product.title;
    offerExist.product_image = offerInfo.product.images[0].url;
    await offerExist.save();
    return offerExist;
  } else {
    const offer = new Offer({
      public_offer_id: offerId,
      price: offerInfo.price,
      quantity: offerInfo.quantity,
      seller_id: offerInfo.seller.id,
      seller_display_name: offerInfo.seller.displayName,
      seller: offerInfo.seller,
      product_id: offerInfo.product.id,
      product_ean: offerInfo.product.ean,
      product_title: offerInfo.product.title,
      product_image: offerInfo.product.images[0].url,
      created: Date.now(),
    });
    const newOfferInfo = {
      time_checked: Date.now(),
      quantity: offerInfo.quantity,
      quantitySoldSincePrevious: 0,
      price: offerInfo.price,
    };
    offer.updates.push(newOfferInfo);
    return await offer.save();
  }
};

const deleteInactiveOffers = async (offer) => {
  const oldDate = new Date(offer.created);
  const newDate = new Date();
  const difference = (newDate.getTime() - oldDate.getTime()) / 1000 / 86400;
  if (difference > 5 && offer.total_sold < 1) {
    console.log(offer.seller_display_name, offer.product_title);
    await Offer.findOneAndDelete({ _id: offer._id }).exec();
    return true;
  } else {
    return false;
  }
};

const deleteOldOffers = async (product) => {
  const offers = await Offer.find({ product_id: product.product_id }).exec();
  offers.forEach(async (offer) => {
    const oldDate = new Date(offer.created);
    const newDate = new Date();
    const difference = (newDate.getTime() - oldDate.getTime()) / 1000 / 86400;
    if (difference > 5 && offer.total_sold < 1) {
      console.log(offer._id);
      await Offer.findOneAndDelete({ _id: offer._id }).exec();
    }
  });
  return true;
};

const analyzeStock = async (offerId, offer, priceOneUnit) => {
  const offerDoc = await Offer.findOne({ public_offer_id: offerId }).exec();
  const productDoc = await Product.findOne({
    product_id: offer.product.id,
  }).exec();
  if (offerDoc.updates.length > 0) {
    const deleted = await deleteInactiveOffers(offerDoc);
    if (deleted) {
      console.log('deleted');
      return false;
    } else {
      const oldOfferInfo = offerDoc.updates[offerDoc.updates.length - 1];
      const sold =
        oldOfferInfo.quantity - offer.quantity > 0
          ? oldOfferInfo.quantity - offer.quantity
          : 0;
      const newOfferInfo = {
        time_checked: Date.now(),
        quantity: offer.quantity,
        quantitySoldSincePrevious: sold,
        price: priceOneUnit,
      };
      offerDoc.updates.push(newOfferInfo);
      const difference =
        (new Date(newOfferInfo.time_checked).getTime() -
          new Date(oldOfferInfo.time_checked).getTime()) /
        1000;
      let maxSold;
      if (difference < 3600) {
        maxSold = 10;
      } else if (3600 < difference < 86400) {
        maxSold = 30;
      } else if (86400 < difference < 259200) {
        maxSold = 90;
      } else if (difference > 259200) {
        maxSold = 120;
      } else {
        maxSold = 10;
      }
      if (sold > 0 && sold < maxSold) {
        offerDoc.total_sold = offerDoc.total_sold + sold;
        productDoc.total_sold = productDoc.total_sold + sold;
        productDoc.save();
      }
      offerDoc.quantity = offer.quantity;
      offerDoc.price = priceOneUnit;
      await offerDoc.save();
      return offerDoc;
    }
  } else {
    const update = {
      time_checked: Date.now(),
      quantity: offer.quantity,
      quantitySoldSincePrevious: 0,
      price: priceOneUnit,
    };
    offerDoc.updates.push(update);
    await offerDoc.save();
    return offerDoc;
  }
};

// const updateProductData = async (product) => {
//   const newData = new Date();
//   const lastProductUpdate = new Date(product.last_product_check);
//   const difference =
//     (newData.getTime() - lastProductUpdate.getTime()) / 1000 / 86400;
//   if (difference > 10) {
//     // const updatedProduct = await updateProduct(product.product_id);
//   }
// };

const startCronJob = () => {
  cronMonitor.start();
  return true;
};

const stopCronJob = () => {
  console.log(cronMonitor.stop());
  return true;
};

// const cronMonitor = new CronJob('00 00 00 * * *', () => {
const cronMonitor = new CronJob('0 */10 * * * *', () => {
  monitor();
});

const getCronJobStatus = () => {
  return { status: cronMonitor.running, nextRun: cronMonitor.nextDates() };
};

const monitor = async (productId) => {
  const products = await getProductsToMonitor(productId);
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    const oldDate = new Date(product.last_offer_check);
    const oldDateWipe = new Date(product.last_old_offer_wipe);
    const newDate = new Date();
    const difference = (newDate.getTime() - oldDate.getTime()) / 1000;
    if ((newDate.getTime() - oldDateWipe.getTime()) / 1000 / 86400 > 3) {
      await deleteOldOffers(product);
      product.last_old_offer_wipe = Date.now();
      await product.save();
    }
    if (difference > 0) {
      const productNew = await updateProductOffers(product.product_id, product);
      if (productNew) {
        if (productNew.offer_ids.length > 0) {
          for (let x = 0; x < productNew.offer_ids.length; x++) {
            let offerItem = productNew.offer_ids[x];
            const offer = await getStock(offerItem.id, 500);
            if (offer) {
              await saveOffer(offerItem.id, offer);
              const priceOneUnit = await getPriceOneItem(offerItem.id);
              if (priceOneUnit) {
                await analyzeStock(offerItem.id, offer, priceOneUnit);
              }
            }
          }
        }
      } else {
        console.log('error productChecker');
      }
    }
  }
  showTotalCalls();
  return true;

  // products.forEach(async (product) => {
  //   const oldDate = new Date(product.last_offer_check);
  //   const oldDateWipe = new Date(product.last_old_offer_wipe);
  //   const newDate = new Date();
  //   const difference = (newDate.getTime() - oldDate.getTime()) / 1000;

  //   if ((newDate.getTime() - oldDateWipe.getTime()) / 1000 / 86400 > 3) {
  //     deleteOldOffers(product);
  //     product.last_old_offer_wipe = Date.now();
  //     product.save();
  //   }
  //   if (difference > 0) {
  //     console.log(product.title);
  //     const productNew = await updateProductOffers(product.product_id, product);
  //     if (productNew) {
  //       if (productNew.offer_ids.length > 0) {
  //         productNew.offer_ids.forEach(async (offerItem) => {
  //           const offer = await getStock(offerItem.id, 500);
  //           if (offer) {
  //             await saveOffer(offerItem.id, offer);
  //             const priceOneUnit = await getPriceOneItem(offerItem.id);
  //             if (priceOneUnit) {
  //               await analyzeStock(offerItem.id, offer, priceOneUnit);
  //             }
  //           }
  //         });
  //       }
  //     } else {
  //       console.log('error productChecker');
  //     }
  //   }
  // });

  // products.forEach(async (product) => {
  //   const oldDate = new Date(product.last_offer_check);
  //   const oldDateWipe = new Date(product.last_old_offer_wipe);
  //   const newDate = new Date();
  //   const difference = (newDate.getTime() - oldDate.getTime()) / 1000;
  //   if ((newDate.getTime() - oldDateWipe.getTime()) / 1000 / 86400 > 3) {
  //     await deleteOldOffers(product);
  //     product.last_old_offer_wipe = Date.now();
  //     await product.save();
  //   }
  //   if (difference > 0) {
  //     const productNew = await updateProductOffers(product.product_id, product);
  //     if (productNew) {
  //       if (productNew.offer_ids.length > 0) {
  //         productNew.offer_ids.forEach(async (offerItem) => {
  //           const offer = await getStock(offerItem.id, 500);
  //           if (offer) {
  //             await saveOffer(offerItem.id, offer);
  //             const priceOneUnit = await getPriceOneItem(offerItem.id);
  //             if (priceOneUnit) {
  //               await analyzeStock(offerItem.id, offer, priceOneUnit);
  //             }
  //           }
  //         });
  //       }
  //     } else {
  //       console.log('error productChecker');
  //     }
  //   }
  // });

  // products.forEach(async (product) => {
  //   const oldDate = new Date(product.last_offer_check);
  //   const oldDateWipe = new Date(product.last_old_offer_wipe);
  //   const newDate = new Date();
  //   const difference = (newDate.getTime() - oldDate.getTime()) / 1000;
  //   if ((newDate.getTime() - oldDateWipe.getTime()) / 1000 / 86400 > 3) {
  //     await deleteOldOffers(product);
  //     product.last_old_offer_wipe = Date.now();
  //     await product.save();
  //   }
  //   if (difference > 0) {
  //     const productNew = await updateProductOffers(product.product_id, product);
  //     if (productNew) {
  //       if (productNew.offer_ids.length > 0) {
  //         productNew.offer_ids.forEach(async (offerItem) => {
  //           const offer = await getStock(offerItem.id, 500);
  //           if (offer) {
  //             await saveOffer(offerItem.id, offer);
  //             const priceOneUnit = await getPriceOneItem(offerItem.id);
  //             if (priceOneUnit) {
  //               await analyzeStock(offerItem.id, offer, priceOneUnit);
  //             }
  //           }
  //         });
  //       }
  //     } else {
  //       console.log('error productChecker');
  //     }
  //   }
  // });
};

// module.exports = monitor;
module.exports.priceMonitor = monitor;
module.exports.trackNewOffer = trackNewOffer;
module.exports.startCronJob = startCronJob;
module.exports.stopCronJob = stopCronJob;
module.exports.getCronJobStatus = getCronJobStatus;
