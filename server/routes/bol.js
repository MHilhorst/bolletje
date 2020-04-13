const express = require('express');
const User = require('../models/User');
const keys = require('../config/keys');
const BolOffer = require('../models/BolOffer');
const jwtAuth = require('express-jwt');
const { getToken } = require('../services/accessToken');
const {
  createOffer,
  getOffer,
  getOffers,
  requestOffersList,
  getOpenOrders,
  getCommission,
} = require('../services/bolServices');
const {
  getOtherOffers,
  saveProduct,
} = require('../services/openApiBolServices');
const { trackNewOffer } = require('../services/productChecker');
const Offer = require('../models/Offer');
const Product = require('../models/Product');

const secret = keys.secretJWT;
const router = express.Router();

router.get('/offer/:id', jwtAuth({ secret }), async (req, res) => {
  const bolOffer = await BolOffer.findOne({ _id: req.params.id }).exec();
  const token = await getToken(req.user._id);
  const offer = await getOffer(bolOffer.offer_id, token);
  const otherOfferData = await getOtherOffers(bolOffer.ean);
  const detailedInfo = {
    ...offer,
    ...otherOfferData,
    bolOffer,
  };
  return res.json({ result: detailedInfo });
});

router.get('/orders', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    const token = await getToken(req.user._id);
    const openOrders = await getOpenOrders(token);
    return res.json({ orders: openOrders });
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

formatProductId = (id) => {
  if (id.includes('www')) {
    console.log(id.split('/')[(5, 6)]);
    return id.split('/')[(5, 6)];
  } else {
    return id;
  }
};

router.post('/products', async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  const max_track_items = user.premium_account ? 100 : user.max_track_items;
  const formattedProductId = formatProductId(req.body.productId);
  if (user.bol_track_items.length < max_track_items) {
    const data = await saveProduct(formattedProductId.toString());
    const { product, newProduct } = data;
    if (newProduct) {
      product.offer_ids.map((offerId) => {
        trackNewOffer(offerId.id);
      });
      user.bol_track_items.push(product._id);
      product.users_tracking.push(user._id);
      await product.save();
      await user.save();
      return res.status(201).json({ success: true, product });
    } else {
      if (!user.bol_track_items.includes(product._id)) {
        user.bol_track_items.push(product._id);
        product.users_tracking.push(user._id);
        await product.save();
        await user.save();
        return res.status(201).json({ success: true, product });
      } else {
        return res.status(401).json({ success: false });
      }
    }
  }
});

router.get('/products', async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  const products = [];
  if (user.premium_account) {
    const products = await Product.find({}).exec();
    return res.status(200).json({ success: true, products });
  } else {
    const productsRaw = user.bol_track_items.map(async (track_item) => {
      return Product.findById(track_item).then((product) =>
        products.push(product)
      );
    });
    Promise.all(productsRaw).then(() => {
      return res.json({ success: true, products });
    });
  }
});

router.get('/products/:id', async (req, res) => {
  const product = await Product.findOne({ product_id: req.params.id }).exec();
  return res.json(product);
});

// router.get("/offer/track/:id", jwtAuth({ secret }), async (req, res) => {
//   Offer.findOne({ public_offer_id: req.params.id }, {}, (err, doc) => {
//     if (err) console.log(err);
//     console.log(doc);
//     res.json({ doc });
//   });
// });

router.get('/product/offers/:id', async (req, res) => {
  Offer.find({ product_id: req.params.id }, (err, offers) => {
    return res.json({ offers });
  });
});

// Important to figure out how to remove all instances of a product from user's bol_track_items array.
router.delete('/products/:id', async (req, res) => {
  if (req.user.premium_account) {
    const product = await Product.findOne({ product_id: req.params.id }).exec();
    if (product.total_sold < 1) {
      Product.findOneAndDelete(
        { product_id: req.params.id },
        async (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            // const users = await User.findOne({
            //   bol_track_items: doc._id,
            // }).exec();
            // console.log(users);
            console.log(doc._id);
            User.updateMany(
              { bol_track_items: doc._id },
              { $pullAll: { bol_track_items: [doc._id] } },
              (err, cb) => {
                if (err) console.log(err);
              }
            );
            Offer.findOneAndDelete(
              { product_id: req.params.id },
              (err, doc) => {
                if (err) {
                  console.log(err);
                } else {
                  return res.status(201).json({ success: true });
                }
              }
            );
          }
        }
      );
    } else {
      return res.status(400).json({ success: false });
    }
  }
});

router.post('/commission', async (req, res) => {
  const token = await getToken(req.user._id);
  const commission = await getCommission(req.body.ean, req.body.price, token);
  res.json({ ...commission });
});

router.get('/v2/offers', async (req, res) => {
  const bolOffers = await BolOffer.find({ user_id: req.user._id }).exec();
  return res.json({ bolOffers });
});

// router.get('/offers/update', jwtAuth({ secret }), async (req, res) => {
//   if (req.user) {
//     const detailedOfferInformation = [];
//     const token = await getToken(req.user._id);
//     const user = await User.findOne({ _id: req.user._id }).exec();
//     user.own_offers = [];
//     const entityId = await requestOffersList(token);
//     if (entityId.error) {
//       res.json({
//         result: [],
//       });
//     } else {
//       const offers = await getOffers(entityId, req.user, token);
//       if (offers.length === 0) {
//         return res.json({ result: [] });
//       } else {
//         const result = offers.map(async (offer) => {
//           const autoOffer = await AutoOffer.findOne({
//             offer_id: offer.offerId,
//           }).exec();
//           let data = await getOffer(token, offer.offerId);
//           let otherOfferData = await getOtherOffers(offer.ean);
//           console.log(data);
//           if (!autoOffer) {
//             const newAutoOffer = new AutoOffer({
//               offer_id: offer.offerId,
//               user_id: req.user._id,
//               ean: offer.ean,
//               product_name: data.store.productTitle,
//             });
//             newAutoOffer.save();
//           }
//           const detailedInfo = {
//             ...data,
//             ...otherOfferData,
//             autoOffer: autoOffer ? autoOffer._doc : newAutoOffer,
//           };
//           user.own_offers.push(offer.offerId);
//           detailedOfferInformation.push(detailedInfo);
//           return data;
//         });
//         Promise.all(result).then((completed) => {
//           user.save();
//           return res.status(200).json({ result: detailedOfferInformation });
//         });
//       }
//     }
//   }
// });

// router.get('/offers', jwtAuth({ secret }), async (req, res) => {
//   const user = await User.findOne({ _id: req.user._id }).exec();
//   const detailedOfferInformation = [];
//   const token = await getToken(req.user._id);
//   if (user.own_offers.length > 0) {
//     const result = user.own_offers.map(async (offerId) => {
//       const autoOffer = await BolOffer.findOne({
//         offer_id: offerId,
//       }).exec();
//       const offer = await getOffer(token, offerId);
//       const otherOfferData = await getOtherOffers(offer.ean);
//       const detailedInfo = {
//         ...offer,
//         ...otherOfferData,
//         autoOffer: autoOffer._doc,
//       };
//       detailedOfferInformation.push(detailedInfo);
//     });
//     Promise.all(result).then((completed) => {
//       return res.status(200).json({ result: detailedOfferInformation });
//     });
//   }
// });

module.exports = router;
