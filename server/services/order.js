const { getOpenOrders, getDetailedOrder } = require('../services/bolServices');
const { getToken } = require('../services/accessToken');
const Order = require('../models/Order');
const User = require('../models/User');
const WC = require('../models/WooCommerceConnection');
const { postOrderWooCommerce } = require('./order-connections/woocommerce');
const getOrders = async (user) => {
  const token = await getToken(user._id);
  const openOrders = await getOpenOrders(token);
  if (openOrders.orders.length > 0) {
    return openOrders.orders;
  } else {
    return false;
  }
};

const getOrder = async (orderId, user) => {
  const token = await getToken(user._id);
  const order = await getDetailedOrder(orderId, token);
  return order;
};

const saveOrder = async (order, user) => {
  const newOrder = new Order({
    user_id: user._id,
    order_id: order.orderId,
    platform: 'bol.com',
    status: 'PENDING',
    order_date: order.dateTimeOrderPlaced,
    customer_details: order.customerDetails,
    order_items: order.orderItems,
  });
  return await newOrder.save();
};

const monitor = async () => {
  const user = await User.findOne({ _id: '5e024682eb7f3d01a4f1dd58' }).exec();
  //   const openOrders = await getOrders(user);
  //   if (openOrders) {
  //     for (let i = 0; i < openOrders.length; i++) {
  //       const data = await getOrder(openOrders[i].orderId, user);
  //       //   const order = await saveOrder(data, user);
  //       const orderTest = await Order.findOne({
  //         _id: '5e28725868e0583d10dd4012',
  //       }).exec();
  //       const wcTest = await WC.findOne({ user_id: user._id }).exec();
  //       postOrderWooCommerce(orderTest, wcTest);
  //     }
  //   }
  const orderTest = await Order.findOne({
    _id: '5e28725868e0583d10dd4012',
  }).exec();
  const wcTest = await WC.findOne({ user_id: user._id }).exec();
  //   postOrderWooCommerce(orderTest, wcTest);
};

module.exports.getOrders = getOrders;
module.exports.orderMonitor = monitor;
