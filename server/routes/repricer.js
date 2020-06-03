const express = require('express');
const User = require('../models/User');
const RepricerOffer = require('../models/RepricerOffer');
const RepricerStrategy = require('../models/RepricerStrategy');
const { getToken } = require('../services/accessToken');
const {
  getCommission,
  requestOffersList,
  getOffersV2,
  updatePrice,
  requestProcessStatus,
} = require('../services/bolServices');
const { monitorRepricerOffer } = require('../services/repricer_service');
const { syncOfferWithDataFeed } = require('../services/datafeed');
const request = require('request');
const {
  setRepricerOffer,
  importStrategyDataFeed,
} = require('../services/repricer_service.js');
const { getOtherOffers } = require('../services/openApiBolServices');
const csv = require('csv-parser');
const fs = require('fs');
const csvtojson = require('csvtojson');
const router = express.Router();

router.post('/commission', async (req, res) => {
  const token = await getToken(req.user._id);
  const commission = await getCommission(req.body.ean, req.body.price, token);
  res.json({ ...commission });
});

router.post('/strategy', async (req, res) => {
  const newStrategy = new RepricerStrategy({
    ...req.body,
    user_id: req.user._id,
  });
  await newStrategy.save();
  if (newStrategy.strategy_type === 'datafeed') {
    importStrategyDataFeed(newStrategy._id, newStrategy.datafeed_url);
  }
  res.status(201).json({ success: true });
});

router.get('/strategy', async (req, res) => {
  const strategies = await RepricerStrategy.find({
    user_id: req.user._id,
  }).exec();
  res.json({ strategies });
});

router.delete('/strategy', async (req, res) => {
  const strategies = req.body.strategies;
  console.log(strategies);
  RepricerStrategy.deleteMany(
    {
      _id: { $in: strategies },
    },
    (err, raw) => {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
      console.log(raw);
      res.json({ success: true });
    }
  );
});

router.put('/strategy', async (req, res) => {
  const offers = req.body.selectedExistingOffers;
  const strategy = req.body.selectedStrategy;
  RepricerOffer.updateMany(
    {
      _id: {
        $in: offers,
      },
    },
    { $set: { strategy: strategy } },
    { upsert: true },
    (err, raw) => {
      if (err) console.log(err);
      res.status(200).json({ success: true });
    }
  );
});

router.put('/strategy/activate', async (req, res) => {
  const activate = req.body.activation ? true : false;
  const strategy = req.body.selectedStrategy;
  const strategyUpdate = RepricerStrategy.updateOne(
    {
      _id: strategy,
    },
    { $set: { activated: activate } },
    (err, raw) => {
      if (err) console.log(err);
      return true;
    }
  );
  const repricerOfferUpdate = RepricerOffer.updateMany(
    {
      strategy: req.body.selectedStrategy,
    },
    { $set: { repricer_active: activate } },
    { upsert: true },
    (err, raw) => {
      if (err) console.log(err);
      return true;
    }
  );
  const repriceOfferUpdate = await RepricerOffer.find;
  Promise.all([repricerOfferUpdate, strategyUpdate]).then((completed) => {
    console.log('finished');
    res.status(200).json({ success: true });
  });
});
router.post('/offers/activate', async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).exec();
  if (30 - user.own_offers.length >= req.body.offers.length) {
    const { offers } = req.body;
    for (let i = 0; i < offers.length; i++) {
      const existingOwnOffer = user.own_offers.findIndex((value) => {
        return value === offers[i];
      });
      if (existingOwnOffer === -1) {
        // Remove offer_Ids from own_offer field of the User Object
        const repricerOffer = await setRepricerOffer(
          { offerId: offers[i] },
          user
        );
        const otherOffers = await getOtherOffers(repricerOffer.ean, true);
        otherOffers.data.offerData.offers.sort((a, b) => {
          return a.price - b.price;
        });
        repricerOffer.selected_competitors = otherOffers.data.offerData.offers.map(
          (offer) => {
            return offer.id;
          }
        );
        repricerOffer.offers_visible = otherOffers.data.offerData.offers;
        repricerOffer.total_sellers =
          otherOffers.data.offerData.offers.length || 0;
        repricerOffer.product_id = otherOffers.productId;
        user.own_offers.push(offers[i]);
        await user.save();
        await repricerOffer.save();
      }
    }
    res.json({ success: true });
  }
});

router.get('/offers/update', async (req, res) => {
  let rowCount = 0;
  let data;
  const token = await getToken(req.user._id);
  const user = await User.findOne({ _id: req.user._id }).exec();
  if (user.status.loading_export_file === false) {
    user.status.export_file_time_created = Date.now();
    user.status.loading_export_file = true;
    await user.save();
    if (req.query.requestId && req.query.requestId !== 'undefined') {
      data = await requestProcessStatus(req.query.requestId, token, user, true);
    } else {
      data = await requestOffersList(token, user, true);
    }
    if (!data.entityId) {
      user.status.export_file = false;
      user.status.loading_export_file = false;
      await user.save();
      return res.status(401).json({ error: true });
    }
    await getOffersV2(data.entityId, req.user._id);
    const totalRow = await new Promise((resolve, reject) => {
      fs.createReadStream(`uploads/bol/${req.user._id}.csv`)
        .pipe(csv())
        .on('data', (row) => {
          rowCount += 1;
        })
        .on('end', () => {
          resolve(rowCount);
        });
    });
    User.findOneAndUpdate(
      { _id: user._id, 'status.updates.id': data.requestId.toString() },
      {
        $set: {
          'status.updates.$.total_items': totalRow,
          'status.updates.$.timestamp': Date.now(),
        },
      },
      { new: true },
      (err, doc) => {}
    );
    user.status.export_file = true;
    user.status.loading_export_file = false;
    const jsonArray = await csvtojson({
      ignoreColumns: /(fulfilmentDeliveryCode|fulfilmentType|mutationDateTime|conditionName|conditionCategory|conditionComment)/,
    }).fromFile(`uploads/bol/${req.user._id}.csv`);
    await user.save();
    res.json({ limitExceeded: true, offers: jsonArray });
  }
});

router.get('/offers/:id', async (req, res) => {
  const repricerOffer = await RepricerOffer.findOne(
    {
      user_id: req.user._id,
      _id: req.params.id,
    },
    {
      'updates.buy_box.id': 0,
      'updates.buy_box.availabilityDescription': 0,
      'updates.buy_box.sellerId': 0,
      'updates.buy_box.sellerType': 0,
      'updates.buy_box.sellerReviews': 0,
      'updates.buy_box.sellerRating': 0,
      'updates.buy_box.sellerApprovalPercentage': 0,
      'updates.buy_box.sellerRegistrationDate': 0,
      'updates.own_offer.id': 0,
      'updates.own_offer.availabilityDescription': 0,
      'updates.own_offer.sellerId': 0,
      'updates.own_offer.sellerType': 0,
      'updates.own_offer.sellerReviews': 0,
      'updates.own_offer.sellerRating': 0,
      'updates.own_offer.sellerApprovalPercentage': 0,
      'updates.own_offer.sellerRegistrationDate': 0,
    }
  ).exec();
  if (repricerOffer) {
    res.json({ repricerOffer });
  } else {
    res.status(401).json({ success: false });
  }
});

router.put('/offers/:id', async (req, res) => {
  const repriceOffer = await RepricerOffer.findOne({
    user_id: req.user._id,
    _id: req.params.id,
  })
    .populate('strategy')
    .exec();
  if (req.body.repricerActive)
    repriceOffer.repricer_active = req.body.repricerActive;
  if (req.body.selectedCompetitors)
    repriceOffer.selected_competitors = req.body.selectedCompetitors;
  if (req.body.hasOwnProperty('customSelectionCompetitors'))
    repriceOffer.custom_selection_competitors =
      req.body.customSelectionCompetitors;
  if (req.body.shippingCost) repriceOffer.shipping_cost = req.body.shippingCost;
  if (req.body.purchasePrice)
    repriceOffer.purchase_price = req.body.purchasePrice;
  await repriceOffer.save();
  if (repriceOffer.repricer_active) {
    await monitorRepricerOffer(repriceOffer, req.user._id);
    res.json({ success: true });
  } else {
    res.json({ success: true });
  }
});

router.get('/offers', async (req, res) => {
  const repricerOffers = await RepricerOffer.find({
    user_id: req.user._id,
  })
    .populate('strategy')
    .exec();
  // getRepricerOffers(1);
  res.json({ offers: repricerOffers });
});

router.post('/upload/csv', async (req, res) => {
  let file = fs.createWriteStream(`uploads/csv/${req.user._id}.csv`);
  const user = await User.findById(req.user._id).exec();
  // let offersInDataFeed = [];
  try {
    const data = new Promise((resolve, reject) => {
      let stream = request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: req.body.url,
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
        user.csv.url = req.body.url;
        user.csv.last_update = Date.now();
        user.save();
        res.json({ success: true });
      });
  } catch (error) {
    res.json({ success: false });
    throw new Error(error);
  }
});

module.exports = router;
