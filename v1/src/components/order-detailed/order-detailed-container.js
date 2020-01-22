import React from 'react';
import OrderDetailedView from './order-detailed-view';
import { getOrder } from '../../utils/order';
export default class OrderDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    const id = this.props.location.pathname.split('/')[2];
    const order = await getOrder(id);
    this.setState({ order: order.order });
    const tableDataOrderItems = [];
    order.order.order_items.map(offerItem => {
      const tableEntry = {
        productName: offerItem.title,
        ean: offerItem.ean,
        quantity: offerItem.quantity,
        latestDeliveryDate: offerItem.latestDeliveryDate,
        expiryDate: offerItem.expiryDate
      };
      tableDataOrderItems.push(tableEntry);
    });
    this.setState({ tableDataOrderItems });
  }

  render() {
    if (this.state.order) {
      return <OrderDetailedView {...this.state} {...this.props} />;
    } else {
      return null;
    }
  }
}
