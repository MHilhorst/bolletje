import React from 'react';
import ProductSoldAnalyticsView from './product-sold-analytics-view';
import { trackNewProduct, getTrackedProducts } from '../../utils/bol';
export default class ProductSoldAnalyticsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: null,
      products: [],
      bolPrice: 0,
      loading: true,
    };
    this.handleTrackNewProduct = this.handleTrackNewProduct.bind(this);
    this.handleProductId = this.handleProductId.bind(this);
  }
  handleTrackNewProduct = async () => {
    const newProduct = await trackNewProduct(this.state.productId);
    if (newProduct) {
      this.props.history.push(
        `/product-sold-analytics/${newProduct.product_id}`
      );
    }
  };
  handleProductId = (e) => {
    this.setState({ productId: e.target.value });
  };
  async componentDidMount() {
    const products = await getTrackedProducts();
    this.setState({ products, loading: false });
  }
  render() {
    if (!this.state.loading) {
      return (
        <ProductSoldAnalyticsView
          handleTrackNewProduct={this.handleTrackNewProduct}
          handleProductId={this.handleProductId}
          productId={this.state.productId}
          products={this.state.products}
          {...this.props}
        />
      );
    } else {
      return null;
    }
  }
}
