const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const Offer = require('../models/Offer');
const Product = require('../models/Product');
const paginate = require('express-paginate');
const {
  startCronJob,
  stopCronJob,
  getCronJobStatus,
  priceMonitor,
} = require('../services/productChecker');
// const PriceMonitor = require('../services/productChecker');
const router = express.Router();

router.use(paginate.middleware(10, 50));

router.get('/products', async (req, res, next) => {
  if (req.query.search) {
    const product = await Product.find({
      $or: [
        { title: { $regex: req.query.search.toLowerCase(), $options: 'i' } },
      ],
    })
      .limit(10)
      .exec();
    res.json({ data: product });
  } else {
    try {
      const [results, itemCount] = await Promise.all([
        Product.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
        Product.count({}),
      ]);
      const pageCount = Math.ceil(itemCount / req.query.limit);
      res.status(200).json({
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results,
        total_items: itemCount,
      });
    } catch (error) {
      next(error);
    }
  }
});

router.get('/products/:id', async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).exec();
  res.json({ product });
});

router.get('/offers/:id', async (req, res) => {
  const offer = await Offer.findOne({ public_offer_id: req.params.id }).exec();
  res.json({ offer });
});

router.get('/users', async (req, res, next) => {
  if (req.query.search) {
    const user = await User.find({
      $or: [
        { email: { $regex: req.query.search.toLowerCase(), $options: 'i' } },
      ],
    })
      .limit(10)
      .exec();
    res.json({ data: user });
  } else {
    try {
      const [results, itemCount] = await Promise.all([
        User.find({}, { password: 0 })
          .limit(req.query.limit)
          .skip(req.skip)
          .lean()
          .exec(),
        User.count({}),
      ]);
      const pageCount = Math.ceil(itemCount / req.query.limit);
      res.status(200).json({
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results,
        total_items: itemCount,
      });
    } catch (err) {
      next(err);
    }
  }
});

router.post('/reload', async (req, res) => {
  if (req.body.productId) {
    const finished = await priceMonitor(req.body.productId);

    return res.status(201).json({ success: finished });
  } else {
    const finished = await priceMonitor();
    return res.status(201).json({ success: finished });
  }
});

router.post('/broadcast', async (req, res) => {
  const message = new Message({
    title: req.body.title,
    user_id: req.user._id,
    message: req.body.message,
  });
  await message.save();
  return res.json({ success: true });
});

router.get('/users/:id', async (req, res) => {
  const user = await User.findOne(
    { _id: req.params.id },
    { password: 0 }
  ).exec();
  res.json({ user });
});

router.post('/monitor', async (req, res) => {
  if (req.body.start) {
    if (startCronJob()) res.status(201).json({ success: true });
  }
  if (req.body.stop) {
    if (stopCronJob()) res.status(201).json({ success: true });
  }
});
router.get('/monitor-status', async (req, res) => {
  const data = getCronJobStatus();
  res.json({ status: data.status, next_run: data.nextRun });
});

module.exports = router;
