const express = require('express');
const User = require('../models/User');
const keys = require('../config/keys');
const jwtAuth = require('express-jwt');
const { getToken } = require('../services/accessToken');
const {
  createOffer,
  getOffer,
  getOffers,
  requestOffersList
} = require('../services/bolServices');
const {
  getOtherOffers,
  saveProduct
} = require('../services/openApiBolServices');
const { trackNewOffer } = require('../services/productChecker');
const Offer = require('../models/Offer');
const Product = require('../models/Product');

const secret = keys.secretJWT;
const router = express.Router();

router.get('/offers/update', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    const detailedOfferInformation = [];
    const token = await getToken(req.user._id);
    const entityId = await requestOffersList(token);
    if (entityId.error) {
      res.json({
        result: []
      });
    } else {
      const offers = await getOffers(token, entityId, req.user);
      if (offers.length === 0) {
        return res.json({ result: [] });
      } else {
        const result = offers.map(async offer => {
          let data = await getOffer(token, offer.offerId);
          let otherOfferData = await getOtherOffers(offer.ean);
          const detailedInfo = { ...data, ...otherOfferData };
          detailedOfferInformation.push(detailedInfo);
          return data;
        });
        Promise.all(result).then(completed => {
          return res.status(200).json({ result: detailedOfferInformation });
        });
      }
    }
  }
});

router.post('/offer', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    const token = await getToken(req.user._id);
    const { ean, condition, price, stockAmount, fulfilment } = req.body;
    const offer = await createOffer(
      token,
      ean,
      condition,
      price,
      stockAmount,
      fulfilment
    );
    if (offer.error) {
      return res.json({ error: true });
    }
    return res.json({ success: true });
  }
});

router.get('/otherOffers/:productId', async (req, res) => {
  const otherOffers = await getOtherOffers(req.params.productId);
  console.log(otherOffers);
  res.json({ otherOffers });
});

router.post('/products', jwtAuth({ secret }), async (req, res) => {
  const product = await saveProduct(req.body.productId);
  product.offer_ids.map(offerId => {
    trackNewOffer(offerId.id);
  });
  res.json({ success: true });
});

router.get('/products', jwtAuth({ secret }), async (req, res) => {
  const products = await Product.find({}).exec();
  return res.json({ products });
});

router.get('/offer/track/:id', jwtAuth({ secret }), async (req, res) => {
  Offer.findOne({ public_offer_id: req.params.id }, {}, (err, doc) => {
    if (err) console.log(err);
    console.log(doc);
    res.json({ doc });
  });
});

router.get('/product/offers/:id', jwtAuth({ secret }), async (req, res) => {
  Offer.find({ product_id: req.params.id }, (err, offers) => {
    return res.json({ offers });
  });
});

module.exports = router;
