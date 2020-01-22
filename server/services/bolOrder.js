const { getOpenOrders, getDetailedOrder } = require('../services/bolServices');
const { getToken } = require('../services/accessToken');
const Order = require('../models/Order');

const monitorBolOrders = async userId => {
  const token = await getToken(userId);
  const openOrders = await getOpenOrders(token);
  const result = openOrders.orders.map(async order => {
    const orderExists = await Order.findOne({ order_id: order.orderId }).exec();
    if (orderExists) {
    } else {
      const orderDetailed = await getDetailedOrder(order.orderId, token);
      const newOrder = new Order({
        user_id: userId,
        order_id: order.orderId,
        platform: 'bol',
        status: 'OPEN',
        order_items: orderDetailed.orderItems,
        order_date: orderDetailed.dateTimeOrderPlaced,
        customer_details: orderDetailed.customerDetails
      });
      newOrder.save();
    }
  });
  return Promise.all(result);
};

module.exports.monitorBolOrders = monitorBolOrders;
