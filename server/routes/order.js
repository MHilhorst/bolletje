const express = require('express');
const User = require('../models/User');
const keys = require('../config/keys');
const BolOffer = require('../models/BolOffer');
const Order = require('../models/Order');
const jwtAuth = require('express-jwt');
const { monitorBolOrders } = require('../services/bolOrder');
const secret = keys.secretJWT;
const router = express.Router();

// router.get('/', jwtAuth({ secret }), async (req, res) => {
//   const result = await monitorBolOrders(req.user._id);
//   if (result) {
//     const ordersOpen = await Order.find({
//       user_id: req.user._id,
//       platform: 'bol',
//       status: 'OPEN'
//     }).exec();
//     return res.json({ orders: ordersOpen });
//   }
// });

// router.get('/:id', jwtAuth({ secret }), async (req, res) => {
//   if (req.user) {
//     const order = await Order.findOne({
//       user_id: req.user._id,
//       _id: req.params.id
//     }).exec();
//     return res.json({ order });
//   }
// });

router.post('/webhook/woocommerce', async (req, res) => {
  console.log(req.body);
  res.status(200);
});

module.exports = router;
