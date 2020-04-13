import React from 'react';
import AdminProductsDetailedView from './admin-products-detailed-view';
import { getProduct, reloadProduct } from '../../utils/admin';
import Loading from '../loading';

export default class AdminProductsDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reloadLoading: false,
    };
  }
  async componentDidMount() {
    const data = await getProduct(this.props.match.params.id);
    this.setState({ product: data.product, loading: false });
  }
  productReload = async () => {
    this.setState({ reloadLoading: true });
    await reloadProduct(this.state.product.product_id);
    this.setState({ reloadLoading: false });
  };
  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <AdminProductsDetailedView
          {...this.props}
          {...this.state}
          productReload={this.productReload}
        />
      );
    }
  }
}
