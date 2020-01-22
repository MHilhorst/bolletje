import React from 'react';
import OrdersView from './orders-view';
import { getBolOpenOrders } from '../../utils/bol';

export default class OrdersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };
  }
  async componentDidMount() {
    const openOrders = await getBolOpenOrders();
    let offerKey = 0;
    const tableOrders = [];
    openOrders.orders.map(order => {
      offerKey += 1;
      const tableItem = {
        key: offerKey,
        platform: 'Bol.com',
        orderId: order._id,
        bolOrderId: order.order_id,
        orderDate: order.order_date,
        orderItems: order.orderItems,
        status: true
      };
      tableOrders.push(tableItem);
    });
    this.setState({ orders: openOrders, bolTableData: tableOrders });
  }
  render() {
    return <OrdersView {...this.state} />;
  }
}
