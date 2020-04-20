const RepricerOffer = require('../models/RepricerOffer');
const User = require('../models/User');
const { getToken } = require('./accessToken');
const { getOffer, updatePrice } = require('./bolServices');
const request = require('request');
const fs = require('fs');
const csv = require('csv-parser');
const { getProductOffers } = require('./openApiBolServices');
const CronJob = require('cron').CronJob;

const setRepricerOffer = async (offerData, user) => {
  const { offerId } = offerData;

  const repricerOfferExist = await RepricerOffer.findOne({
    offer_id: offerId,
  }).exec();
  if (!repricerOfferExist) {
    const token = await getToken(user._id);
    const offer = await getOffer(offerId, token);
    const priceSingleItem =
      offer.pricing.bundlePrices[0].quantity === 1
        ? offer.pricing.bundlePrices[0].price
        : NaN;

    const repricerOffer = new RepricerOffer({
      offer_id: offer.offerId,
      ean: offer.ean,
      bol_active: offer.onHoldByRetailer,
      stock: offer.stock.amount || 0,
      delivery_code: offer.fulfilment.deliveryCode,
      price: priceSingleItem,
      user_id: user._id,
      product_title: offer.store.productTitle,
    });
    await repricerOffer.save();
    return repricerOffer;
  } else {
    return repricerOfferExist;
  }
};
const getAllOffers = async (productId) => {
  const offers = await getProductOffers(productId);
  if (offers.products[0].hasOwnProperty('offerData')) {
    return offers.products[0].offerData;
  } else {
    console.trace('Error');
    return false;
  }
};

const monitorRepricerOffer = async (repriceOffer, userId) => {
  const token = await getToken(userId);
  const ownOffer = await getOffer(repriceOffer.offer_id, token);

  if (ownOffer.onHoldByRetailer) {
    console.log('product not activated');
    repriceOffer.bol_active = false;
    repriceOffer.repricer_active = false;
  } else {
    repriceOffer.bol_active = true;
    const allOffers = await getAllOffers(repriceOffer.product_id);
    repriceOffer.total_sellers = allOffers.offers.length;
    const allOffersWithoutOwnOffer = allOffers.offers.filter((offer) => {
      return offer.seller.displayName !== 'cryptostarterkit.nl';
    });
    const ownOfferFromBolStoreView = allOffers.offers.filter((offer) => {
      return offer.seller.displayName === 'cryptostarterkit.nl';
    });
    allOffersWithoutOwnOffer.sort((a, b) => {
      return a.price - b.price;
    });
    const lowestPriceOffer = allOffersWithoutOwnOffer[0];
    if (ownOfferFromBolStoreView.best_offer) {
      repricerOffer.best_offer = true;
      return await repriceOffer.save();
    }
    if (
      lowestPriceOffer.price < ownOffer.pricing.bundlePrices[0].price &&
      lowestPriceOffer.price - 0.01 > repriceOffer.min_price
    ) {
      const newPrice = lowestPriceOffer.price - 0.05;
      const token = await getToken(userId);
      const data = await updatePrice(repriceOffer.offer_id, newPrice, token);
      if (data) {
        const updateInfo = {
          time_checked: Date.now(),
          lower_price: true,
          competitor_price: lowestPriceOffer.price,
          new_price: newPrice,
          competitor_name: lowestPriceOffer.seller.displayName,
          competitor_id: lowestPriceOffer.seller.id,
          best_offer: ownOfferFromBolStoreView.best_offer ? true : false,
        };
        repriceOffer.price = newPrice;
        repriceOffer.best_offer = ownOfferFromBolStoreView.best_offer
          ? true
          : false;
        repriceOffer.updates.push(updateInfo);
        return await repriceOffer.save();
      }
    }
    if (ownOffer.pricing.bundlePrices[0].price < lowestPriceOffer.price) {
      const newPrice = lowestPriceOffer.price - 0.01;
      const token = await getToken(userId);
      const data = await updatePrice(repriceOffer.offer_id, newPrice, token);
      if (data) {
        const updateInfo = {
          time_checked: Date.now(),
          lower_price: false,
          competitor_price: lowestPriceOffer.price,
          new_price: newPrice,
          competitor_name: lowestPriceOffer.seller.displayName,
          competitor_id: lowestPriceOffer.seller.id,
          best_offer: ownOfferFromBolStoreView.best_offer ? true : false,
        };
        repriceOffer.price = newPrice;
        repriceOffer.stock = ownOffer.stock.amount;
        repriceOffer.best_offer = ownOfferFromBolStoreView.best_offer
          ? true
          : false;
        repriceOffer.updates.push(updateInfo);
        return await repriceOffer.save();
      }
    } else {
      return await repriceOffer.save();
    }
  }
};

let startTrackingTime;

const startCronJobRepricer = () => {
  cronMonitor.start();
  cronCSVImport.start();
  startTrackingTime = Date.now();
  return true;
};

const stopCronJobRepricer = () => {
  cronMonitor.start();
  cronCSVImport.start();
  return true;
};

const cronMonitor = new CronJob('0 */03 * * * *', () => {
  getRepricerOffers(1);
  console.log('updated');
});

const cronCSVImport = new CronJob('0 */02 * * * *', () => {
  importCSV();
  console.log('updated imports');
});
const getCronJobStatusRepricer = () => {
  return {
    status: cronMonitor.running,
    nextRun: cronMonitor.nextDates(),
    startTrackingTime: startTrackingTime,
  };
};

const getRepricerOffers = async (time) => {
  let test = new Date(new Date().getTime() - time * 1000);
  const repricerOffers = await RepricerOffer.find({
    last_update: { $lte: test },
    repricer_active: true,
  })
    .sort({ last_update: 1 })
    .limit(100)
    .exec();
  for (let i = 0; i < repricerOffers.length; i++) {
    monitorRepricerOffer(repricerOffers[0], repricerOffers[0].user_id);
  }
};

const importCSV = async () => {
  let test = new Date(new Date().getTime() - 1 * 1000);
  const users = await User.find(
    { 'csv.last_update': { $lte: test }, 'csv.url': { $ne: null } },
    { bol_track_items: 0, own_offers: 0 }
  )
    .sort({ 'csv.last_update': 1 })
    .limit(10)
    .exec();
  users.forEach(async (user) => {
    let file = fs.createWriteStream(`uploads/csv/${user._id}.csv`);
    const data = new Promise((resolve, reject) => {
      let stream = request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: user.csv.url,
        headers: {
          Accept: 'text/csv; charset=utf-8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language':
            'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
          'Cache-Control': 'max-age=0',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        },
        /* GZIP true for most of the websites now, disable it if you don't need it */
        gzip: true,
      })
        .pipe(file)
        .on('finish', () => {
          console.log(`The file is finished downloading.`);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    data
      .then(() => {
        fs.createReadStream(`uploads/csv/${user._id}.csv`)
          .pipe(csv())
          .on('data', async (row) => {
            const repricerOffer = await RepricerOffer.findOne(
              {
                ean: row.ean,
                user_id: user._id,
              },
              { updates: 0, offers_visible: 0 }
            )
              .limit(1)
              .exec();
            if (repricerOffer) {
              if (row.active == 'true' && row.min_price) {
                repricerOffer.repricer_active = true;
                repricerOffer.min_price = row.min_price;
              }
              if (
                repricerOffer.repricer_active &&
                row.active == 'false' &&
                row.original_price
              ) {
                repricerOffer.repricer_active = false;
                const token = await getToken(user._id);
                const data = await updatePrice(
                  repricerOffer.offer_id,
                  Number(row.original_price),
                  token
                );
                if (data) {
                  repricerOffer.price = Number(row.original_price);
                }
              }
              if (
                repricerOffer.price !== Number(row.original_price) &&
                row.active == 'false' &&
                row.original_price
              ) {
                repricerOffer.repricer_active = false;
                const token = await getToken(user._id);
                const data = await updatePrice(
                  repricerOffer.offer_id,
                  Number(row.original_price),
                  token
                );
                if (data) {
                  repricerOffer.price = Number(row.original_price);
                }
              }
              repricerOffer.linked_to_spreadsheet = true;
              repricerOffer.save();
            }
          });
      })
      .then(() => {
        user.save();
      });
  });
};

module.exports.setRepricerOffer = setRepricerOffer;
module.exports.monitorRepricerOffer = monitorRepricerOffer;
module.exports.getRepricerOffers = getRepricerOffers;
module.exports.stopCronJobRepricer = stopCronJobRepricer;
module.exports.startCronJobRepricer = startCronJobRepricer;
module.exports.getCronJobStatusRepricer = getCronJobStatusRepricer;
