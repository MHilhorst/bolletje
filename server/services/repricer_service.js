const RepricerOffer = require('../models/RepricerOffer');
const User = require('../models/User');
const RepricerStrategy = require('../models/RepricerStrategy');
const { getToken } = require('./accessToken');
const { getOffer, updatePrice, getCommission } = require('./bolServices');
const request = require('request');
const fs = require('fs');
const {
  syncOfferWithDataFeed,
  syncOfferWithDataFeedV2,
} = require('./datafeed');
const { getProductOffers, showTotalCalls } = require('./openApiBolServices');
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
    const commissionPercentage = await getCommission(
      offer.ean,
      priceSingleItem,
      token
    );
    const repricerOffer = new RepricerOffer({
      offer_id: offer.offerId,
      ean: offer.ean,
      bol_active: offer.onHoldByRetailer,
      stock: offer.stock.amount || 0,
      delivery_code: offer.fulfilment.deliveryCode,
      price: priceSingleItem,
      standard_commission_percentage: commissionPercentage.percentage,
      standard_commission_fixed_amount: commissionPercentage.fixedAmount,
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
  const allOffersOwnOfferHighlighted = allOffers.map((offer) => {
    return {
      ...offer,
      ownOffer: offer.seller.displayName === user.bol_shop_name ? true : false,
    };
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
  const lowestPriceOffer = allOffersWithoutOwnOffer
    .sort((a, b) => {
      return a.price - b.price;
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
  const bestOffer = allOffers
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
    allOffersOwnOfferHighlighted,
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
    const commission = await getCommission(repriceOffer.ean, newPrice, token);
    repriceOffer.commission = commission;
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
    repriceOffer.offers_visible = objectOffers.allOffersOwnOfferHighlighted;
    repriceOffer.total_sellers = objectOffers.allOffers.length;
    repriceOffer.best_offer = objectOffers.bestOffer;
    if (objectOffers.ownOfferFromBolStoreView) {
      repriceOffer.best_offer_is_own_offer =
        objectOffers.bestOffer.id === objectOffers.ownOfferFromBolStoreView.id
          ? true
          : false;
    } else {
      repriceOffer.best_offer_is_own_offer = false;
    }

    const targetType = repriceOffer.strategy.strategy_type;
    const commissionPercentage =
      (100 - repriceOffer.standard_commission_percentage) / 100;
    const commissionFixedAmount = repriceOffer.standard_commission_fixed_amount;
    const ROIPercentageMultipliedByCosts =
      (repriceOffer.purchase_price + repriceOffer.shipping_cost) *
        ((100 + repriceOffer.strategy.minimum_pricing.percentage) / 100) +
      commissionFixedAmount;
    const minimumPrice =
      repriceOffer.strategy.minimum_pricing.pricing_type === 'ROI'
        ? ROIPercentageMultipliedByCosts / commissionPercentage
        : null;
    const competeWithBol = repriceOffer.strategy.compete_with_bol;

    if (repriceOffer.repricer_active) {
      const targetOffer =
        targetType === 'targetBuyBox'
          ? objectOffers.bestOffer
          : objectOffers.lowestPriceOffer;
      const shouldCompeteAgainstTargetOffer =
        targetOffer.sellerId !== '0'
          ? true
          : targetOffer.sellerId === '0' && competeWithBol === true
          ? true
          : false;
      // console.log(
      //   'Compete with target offer?',
      //   shouldCompeteAgainstTargetOffer
      // );
      repriceOffer.min_price = minimumPrice.toFixed(2);
      if (repriceOffer.best_offer_is_own_offer) {
        if (
          repriceOffer.best_offer_is_own_offer &&
          !repriceOffer.updated_best_offer_price
        ) {
          const {
            increment_type,
            pricing_increment_type,
            pricing_increment,
            increment_operator,
          } = repriceOffer.strategy.buy_box_price_action;
          const priceIncrement =
            increment_type === 'currentPrice'
              ? 0
              : pricing_increment_type === '€' && increment_operator === 'plus'
              ? pricing_increment
              : pricing_increment_type === '€' && increment_operator === 'minus'
              ? -pricing_increment
              : pricing_increment_type === '%' && increment_operator === 'minus'
              ? -repriceOffer.price * (pricing_increment / 100)
              : pricing_increment_type === '%' && increment_operator === 'plus'
              ? repriceOffer.price * (pricing_increment / 100)
              : null;
          console.log(priceIncrement);
          const newPrice = repriceOffer.price + priceIncrement;
          updatedRepriceOffer = await autoUpdatePrice(
            repriceOffer,
            userId,
            newPrice,
            objectOffers
          );
          repriceOffer.updated_best_offer_price = true;
        }
      } else {
        repriceOffer.updated_best_offer_price = false;
        if (targetOffer.price <= ownPrice && shouldCompeteAgainstTargetOffer) {
          const pricingIncrement =
            repriceOffer.strategy.price_increment_type === '€' &&
            repriceOffer.strategy.increment_type === 'priceBelow'
              ? repriceOffer.strategy.price_increment
              : repriceOffer.strategy.price_increment_type === '%' &&
                repriceOffer.strategy.increment_type === 'priceBelow'
              ? (repriceOffer.strategy.price_increment / 100) *
                targetOffer.price
              : repriceOffer.strategy.increment_type === 'matchPrice'
              ? 0
              : null;
          const newPrice = (targetOffer.price - pricingIncrement).toFixed(2);
          if (newPrice > repriceOffer.min_price) {
            updatedRepriceOffer = await autoUpdatePrice(
              repriceOffer,
              userId,
              newPrice,
              objectOffers
            );
          }
        }
        if (ownPrice < repriceOffer.min_price) {
          updatedRepriceOffer = await autoUpdatePrice(
            repriceOffer,
            userId,
            repriceOffer.min_price,
            objectOffers
          );
        }
      }
      await repriceOffer.save();
    }
    if (
      repriceOffer.strategy.strategy_type === 'datafeed' &&
      repriceOffer.repricer_active
    ) {
      // const data = await importStrategyDataFeed(
      //   repriceOffer.strategy._id,
      //   repriceOffer.strategy.datafeed_url
      // );
      syncOfferWithDataFeedV2(user, repriceOffer);
    } else {
      console.log('saving product');
      const updateInfo = {
        time_checked: Date.now(),
        buy_box: objectOffers.bestOffer,
        new_price: repriceOffer.price,
        own_offer: objectOffers.ownOfferFromBolStoreView,
      };
      repriceOffer.updates.push(updateInfo);
      await repriceOffer.save();
    }
  }
  return true;
};

let startTrackingTime;

const startCronJobRepricer = () => {
  cronMonitor.start();
  cronCSVImport.start();
  startTrackingTime = Date.now();
  return true;
};

const stopCronJobRepricer = () => {
  cronMonitor.stop();
  cronCSVImport.stop();
  return true;
};

// const cronMonitor = new CronJob('0 */03 * * * *', () => {
const cronMonitor = new CronJob('*/20 * * * * *', () => {
  getRepricerOffers(1);
  console.log('updated Monitor');
});

const cronCSVImport = new CronJob('*/20 * * * * *', () => {
  importCSV();
  console.log('updated Imports');
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
    _id: '5eb670ab460710688d785644',
  })
    .populate('strategy')
    .sort({ last_update: 1 })
    .limit(100)
    .exec();
  console.log('Amount of repricer offers :', repricerOffers.length);
  for (let i = 0; i < repricerOffers.length; i++) {
    monitorRepricerOffer(repricerOffers[i], repricerOffers[i].user_id);
  }
  showTotalCalls();
};

const importStrategyDataFeed = async (id, url) => {
  let file = fs.createWriteStream(`uploads/csv/${id}.csv`);
  const data = new Promise((resolve, reject) => {
    let stream = request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: url,
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
        console.log(id);
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
  data.then(() => {
    console.log('Finished downloading file');
    return true;
  });
};

const importCSV = async () => {
  let test = new Date(new Date().getTime() - 1 * 1000);
  const strategies = await RepricerStrategy.find({
    // 'csv.last_update': { $lte: test },
    datafeed_url: { $ne: null },
    strategy_type: 'datafeed',
  })
    // .sort({ 'csv.last_update': 1 })
    .limit(10)
    .exec();
  strategies.forEach(async (strategy) => {
    let file = fs.createWriteStream(`uploads/csv/${strategy._id}.csv`);
    const data = new Promise((resolve, reject) => {
      let stream = request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: strategy.datafeed_url,
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
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  });
  // let test = new Date(new Date().getTime() - 1 * 1000);
  // const users = await User.find(
  //   { 'csv.last_update': { $lte: test }, 'csv.url': { $ne: null } },
  //   { bol_track_items: 0, own_offers: 0 }
  // )
  //   .sort({ 'csv.last_update': 1 })
  //   .limit(10)
  //   .exec();
  // users.forEach(async (user) => {
  //   let file = fs.createWriteStream(`uploads/csv/${user._id}.csv`);
  //   const data = new Promise((resolve, reject) => {
  //     let stream = request({
  //       /* Here you should specify the exact link to the file you are trying to download */
  //       uri: user.csv.url,
  //       headers: {
  //         Accept: 'text/csv; charset=utf-8',
  //         'Accept-Encoding': 'gzip, deflate, br',
  //         'Accept-Language':
  //           'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
  //         'Cache-Control': 'max-age=0',
  //         Connection: 'keep-alive',
  //         'Upgrade-Insecure-Requests': '1',
  //         'User-Agent':
  //           'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
  //       },
  //       /* GZIP true for most of the websites now, disable it if you don't need it */
  //       gzip: true,
  //     })
  //       .pipe(file)
  //       .on('finish', () => {
  //         resolve();
  //       })
  //       .on('error', (error) => {
  //         reject(error);
  //       });
  //   });
  //   data
  //     .then(() => {
  //       const promise = syncOfferWithDataFeed(user);
  //       return promise;
  //     })
  //     .then((offersInDataFeed) => {
  //       user.csv.ean = offersInDataFeed;
  //       user.csv.last_update = Date.now();
  //       user.save();
  //     });
  // });
};

module.exports.setRepricerOffer = setRepricerOffer;
module.exports.monitorRepricerOffer = monitorRepricerOffer;
module.exports.getRepricerOffers = getRepricerOffers;
module.exports.stopCronJobRepricer = stopCronJobRepricer;
module.exports.startCronJobRepricer = startCronJobRepricer;
module.exports.importStrategyDataFeed = importStrategyDataFeed;
module.exports.getCronJobStatusRepricer = getCronJobStatusRepricer;
