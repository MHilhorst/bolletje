import React from 'react';
import AdminProductsView from './admin-products-view';
import {
  getProducts,
  getProductQuery,
  reloadAllProducts,
} from '../../utils/admin';
import { throttle } from 'throttle-debounce';

export default class AdminProductsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reloadLoading: false,
    };
    this.changePagination = this.changePagination.bind(this);
    this.searchProduct = this.searchProduct.bind(this);
    this.autocompleteSearchThrottled = throttle(500, this.fetchProduct);
  }
  setTableData = async (products) => {
    const tableData = products.map((product, index) => {
      return {
        key: index,
        productId: product.product_id,
        internalId: product._id,
        ean: product.ean,
        title: product.title,
        activeOffersLength: product.active_offers.length,
        lastOfferCheck:
          (new Date().getTime() -
            new Date(product.last_offer_check).getTime()) /
          1000 /
          60,
        trackingSince: product.tracking_since,
        usersTracking: product.hasOwnProperty('users_tracking')
          ? product.users_tracking.length
          : 0,
        totalOffers: product.offer_ids.length,
      };
    });
    this.setState({ tableData });
  };
  fetchProduct = async (product) => {
    const products = await getProductQuery(product);
    this.setTableData(products.data);
  };
  changePagination = async (e) => {
    this.props.history.push({
      pathname: '/admin/products',
      search: `?page=${e}`,
    });
    const products = await getProducts(window.location.search);
    this.setTableData(products.data);
  };
  async componentDidMount() {
    const products = await getProducts(window.location.search);
    this.setTableData(products.data);
    this.setState({ totalProducts: products.total_items });
  }
  searchProduct = (value) => {
    this.setState({ productQuery: value }, () => {
      this.autocompleteSearchThrottled(this.state.productQuery);
    });
  };
  reload = async () => {
    this.setState({ reloadLoading: true });
    await reloadAllProducts();
    this.setState({ reloadLoading: false });
  };

  render() {
    return (
      <AdminProductsView
        {...this.props}
        changePagination={this.changePagination}
        {...this.state}
        reload={this.reload}
        searchProduct={this.searchProduct}
      />
    );
  }
}
