const express = require('express');
const User = require('../models/User');
const RepricerOffer = require('../models/RepricerOffer');
const { getToken } = require('../services/accessToken');
const {
  getCommission,
  requestOffersList,
  getOffersV2,
  updatePrice,
  requestProcessStatus,
} = require('../services/bolServices');
const request = require('request');
const { setRepricerOffer } = require('../services/repricer_service.js');
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

// router.get('/offers/update', async (req, res) => {
//   const token = await getToken(req.user._id);
//   const user = await User.findOne({ _id: req.user._id }).exec();
//   if (user.status.loading_export_file === false) {
//     user.status.export_file_time_created = Date.now();
//     user.status.loading_export_file = true;
//     await user.save();
//     const entityId = await requestOffersList(token, user);
//     if (!entityId) {
//       user.status.export_file = false;
//       user.status.loading_export_file = false;
//       await user.save();
//       return res.status(401).json({ success: false });
//     }
//     const ownOffers = await getOffers(entityId, token);
//     for (let i = 0; i < ownOffers.length; i++) {
//       const repricerOffer = await setRepricerOffer(ownOffers[i], user);
//       const otherOffers = await getOtherOffers(repricerOffer.ean, true);

//       otherOffers.data.offerData.offers.sort((a, b) => {
//         return a.price - b.price;
//       });
//       repricerOffer.offers_visible = otherOffers.data.offerData.offers;
//       repricerOffer.total_sellers =
//         otherOffers.data.offerData.offers.length || 0;
//       repricerOffer.product_id = otherOffers.productId;
//       await repricerOffer.save();
//     }
//     if (entityId) {
//       user.status.export_file = true;
//     }
//     user.status.loading_export_file = false;
//     await user.save();
//     res.status(200).json({ success: true });
//   } else {
//     res.status(401).json({ success: false });
//   }
// });

router.post('/offers/activate', async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).exec();
  if (req.body.offers.length < 30 && user.own_offers.length < 30) {
    const { offers } = req.body;
    for (let i = 0; i < offers.length; i++) {
      const existingOwnOffer = user.own_offers.findIndex((value) => {
        return value === offers[i];
      });
      if (existingOwnOffer) {
        const repricerOffer = await setRepricerOffer(
          { offerId: offers[i] },
          user
        );
        console.log(repricerOffer);
        const otherOffers = await getOtherOffers(repricerOffer.ean, true);
        otherOffers.data.offerData.offers.sort((a, b) => {
          return a.price - b.price;
        });
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
    if (req.query.requestId) {
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

router.put('/offers/:id', async (req, res) => {
  const repriceOffer = await RepricerOffer.findOne({
    user_id: req.user._id,
    _id: req.params.id,
  }).exec();
  if (req.body.repricerActive)
    repriceOffer.repricer_active = req.body.repricerActive;
  await repriceOffer.save();
  res.json({ success: true });
});

router.get('/offers', async (req, res) => {
  const repricerOffers = await RepricerOffer.find({
    user_id: req.user._id,
  }).exec();
  // getRepricerOffers(1);
  res.json({ offers: repricerOffers });
});

router.post('/upload/csv', async (req, res) => {
  let file = fs.createWriteStream(`uploads/csv/${req.user._id}.csv`);
  const user = await User.findById(req.user._id).exec();
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
        fs.createReadStream(`uploads/csv/${req.user._id}.csv`)
          .pipe(csv())
          .on('data', async (row) => {
            const repricerOffer = await RepricerOffer.findOne(
              {
                ean: row.ean,
                user_id: user._id,
              },
              { updates: 0, offers_visible: 0 }
            ).exec();
            console.log(row);
            if (repricerOffer && row.active == 'true') {
              repricerOffer.repricer_active = true;
              repricerOffer.min_price = row.min_price;
            }
            if (repricerOffer.repricer_active && row.active == 'false') {
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
              row.active == 'false'
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
            await repricerOffer.save();
          });
      })
      .then(async () => {
        user.csv.url = req.body.url;
        user.csv.last_update = Date.now();
        await user.save();
        res.json({ success: true });
      });
  } catch (error) {
    res.json({ success: false });
    throw new Error(error);
  }
});

module.exports = router;
