import React from 'react';
import TrackNewProductView from './track-new-product-view';
import { trackNewProduct } from '../../utils/bol';

export default class TrackNewProductContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSubmit = async () => {
    const data = await trackNewProduct(this.state.productId);
    if (data.success) {
      this.props.history.push(
        `/product-sold-analytics/${data.product.product_id}`
      );
    } else {
      this.setState({ error: true });
    }
  };

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  render() {
    return (
      <TrackNewProductView
        {...this.state}
        handleSubmit={this.handleSubmit}
        onChange={this.onChange}
      />
    );
  }
}
