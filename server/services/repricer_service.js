const RepricerOffer = require('../models/RepricerOffer');
const User = require('../models/User');
const { getToken } = require('./accessToken');
const { getOffer, updatePrice } = require('./bolServices');
const request = require('request');
const fs = require('fs');
const { syncOfferWithDataFeed } = require('./datafeed');
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

const getTypesOfOffers = async (repriceOffer, user) => {
  let allOffers = await getAllOffers(repriceOffer.product_id);
  allOffers = allOffers.offers.filter((offer) => {
    return offer.condition === 'Nieuw';
  });
  let allOffersWithoutOwnOffer = allOffers.filter((offer) => {
    return (
      offer.seller.displayName !== user.bol_shop_name &&
      offer.condition === 'Nieuw'
    );
  });
  const ownOfferFromBolStoreView = allOffers
    .filter((offer) => {
      return (
        offer.seller.displayName === user.bol_shop_name &&
        offer.condition === 'Nieuw'
      );
    })
    .map((offer) => {
      return {
        id: offer.id,
        price: offer.price,
        bestOffer: offer.bestOffer,
        availabilityCode: offer.availabilityCode,
        availabilityDescription: offer.availabilityDescription,
        sellerId: offer.seller.id,
        sellerType: offer.seller.sellerType,
        sellerDisplayName: offer.seller.displayName,
        sellerTopSeller: offer.seller.topSeller,
        sellerRating: offer.seller.sellerRating,
        sellerReviews: offer.seller.allReviewsCounts,
        sellerApprovalPercentage: offer.seller.approvalPercentage,
        sellerRegistrationDate: offer.seller.registrationDate,
      };
    })[0];
  const lowestPriceOffer = allOffersWithoutOwnOffer.sort((a, b) => {
    return a.price - b.price;
  })[0];
  const bestOffer = allOffersWithoutOwnOffer
    .filter((offer) => {
      return offer.bestOffer === true;
    })
    .map((offer) => {
      return {
        id: offer.id,
        price: offer.price,
        bestOffer: offer.bestOffer,
        availabilityCode: offer.availabilityCode,
        availabilityDescription: offer.availabilityDescription,
        sellerId: offer.seller.id,
        sellerType: offer.seller.sellerType,
        sellerDisplayName: offer.seller.displayName,
        sellerTopSeller: offer.seller.topSeller,
        sellerRating: offer.seller.sellerRating,
        sellerReviews: offer.seller.allReviewsCounts,
        sellerApprovalPercentage: offer.seller.approvalPercentage,
        sellerRegistrationDate: offer.seller.registrationDate,
      };
    })[0];

  const customSelectedOffers = allOffersWithoutOwnOffer.filter((offer) => {
    return repriceOffer.selected_competitors.find((id) => {
      return offer.id === id;
    });
  });

  allOffersWithoutOwnOffer = allOffersWithoutOwnOffer.map((offer) => {
    return {
      id: offer.id,
      price: offer.price,
      bestOffer: offer.bestOffer,
      availabilityCode: offer.availabilityCode,
      availabilityDescription: offer.availabilityDescription,
      sellerId: offer.seller.id,
      sellerType: offer.seller.sellerType,
      sellerDisplayName: offer.seller.displayName,
      sellerTopSeller: offer.seller.topSeller,
      sellerRating: offer.seller.sellerRating,
      sellerReviews: offer.seller.allReviewsCounts,
      sellerApprovalPercentage: offer.seller.approvalPercentage,
      sellerRegistrationDate: offer.seller.registrationDate,
    };
  });
  return {
    allOffers,
    allOffersWithoutOwnOffer,
    ownOfferFromBolStoreView,
    lowestPriceOffer,
    bestOffer,
    customSelectedOffers,
  };
};

const autoUpdatePrice = async (
  repriceOffer,
  userId,
  newPrice,
  objectOffers
) => {
  const token = await getToken(userId);
  const data = await updatePrice(repriceOffer.offer_id, newPrice, token);
  if (data) {
    const updateInfo = {
      time_checked: Date.now(),
      lower_price: true,
      buy_box: objectOffers.bestOffer,
      new_price: newPrice,
      own_offer: objectOffers.ownOfferFromBolStoreView,
    };
    repriceOffer.price = newPrice;
    repriceOffer.updates.push(updateInfo);
    return true;
  }
};

// Volgens Bol.com hoe het koopblok wordt bepaald:
// Prijs: Klanten zijn op zoek naar de beste deal > Minimale prijsverschillen van 0,01 hebben geen impact.
// Leverbelofte : Hoe sneller je kunt leveren, hoe meer kans je maakt op het koopblok. Je maximale aantal lever dagen is bepalend.
// Prestatiescore : Hoger score op servicenormen = Grotere kans op een positie in het koopblok. Wordt 1x per week geupdate
// Koopblok bekend making = 20 minuten
// Don't target Bol.com
// Select your own Competitors.

const getNewPrice = async (repriceOffer, objectOffers) => {
  let selectedOffers = objectOffers.customSelectedOffers
    ? objectOffers.customSelectedOffers
    : objectOffers.allOffersWithoutOwnOffer;
  const lowestPriceOffer = objectOffers.lowestPriceOffer;
  const buyBoxOffer = objectOffers.bestOffer;
  const ownOffer = objectOffers.ownOfferFromBolStoreView;
};

const monitorRepricerOffer = async (repriceOffer, userId) => {
  const token = await getToken(userId);
  const user = await User.findOne(
    { _id: userId },
    { bol_track_items: 0, own_offers: 0, password: 0 }
  ).exec();
  let updatedRepriceOffer;
  const ownOffer = await getOffer(repriceOffer.offer_id, token);
  const ownPrice = ownOffer.pricing.bundlePrices[0].price;
  if (ownOffer.onHoldByRetailer) {
    repriceOffer.bol_active = false;
    repriceOffer.repricer_active = false;
  } else {
    const objectOffers = await getTypesOfOffers(repriceOffer, user);
    repriceOffer.bol_active = true;
    repriceOffer.total_sellers = objectOffers.allOffers.length;
    repriceOffer.best_offer = objectOffers.bestOffer;
    repriceOffer.best_offer_is_own_offer =
      objectOffers.bestOffer.id === objectOffers.ownOfferFromBolStoreView.id
        ? true
        : false;

    // const newPrice = await getNewPrice(repriceOffer, objectOffers);
    if (
      objectOffers.lowestPriceOffer.price < ownPrice &&
      objectOffers.lowestPriceOffer.price - 0.01 > repriceOffer.min_price
    ) {
      let minusPrice = repriceOffer.repricer_increment
        ? repriceOffer.repricer_increment
        : (objectOffers.ownOfferFromBolStoreView.price / 100) * 5;
      const newPrice = objectOffers.lowestPriceOffer.price - minusPrice;
      updatedRepriceOffer = await autoUpdatePrice(
        repriceOffer,
        userId,
        newPrice,
        objectOffers
      );
    }
    if (ownPrice < objectOffers.lowestPriceOffer.price) {
      const newPrice = objectOffers.lowestPriceOffer.price - 0.01;
      updatedRepriceOffer = await autoUpdatePrice(
        repriceOffer,
        userId,
        newPrice,
        objectOffers
      );
    }
    if (updatedRepriceOffer) {
      console.log('updating product');
      await repriceOffer.save();
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

// const cronMonitor = new CronJob('0 */03 * * * *', () => {
const cronMonitor = new CronJob('*/20 * * * * *', () => {
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
        const promise = syncOfferWithDataFeed(user);
        return promise;
      })
      .then((offersInDataFeed) => {
        user.csv.ean = offersInDataFeed;
        user.csv.last_update = Date.now();
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
