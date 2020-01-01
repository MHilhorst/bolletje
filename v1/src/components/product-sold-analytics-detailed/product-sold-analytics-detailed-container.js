import React from "react";
import ProductSoldAnalyticsDetailedView from "./product-sold-analytics-detailed-view";
import {
  getOffersTrackInfoOfProduct,
  getTrackedProduct
} from "../../utils/bol";
export default class ProductSoldAnalyticsDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: null,
      product: null
    };
  }
  async componentDidMount() {
    const id = this.props.match.params.id;
    const offers = await getOffersTrackInfoOfProduct(id);
    const product = await getTrackedProduct(id);
    this.setState({ offers: offers, product });
  }
  render() {
    if (this.state.offers && this.state.product) {
      return (
        <ProductSoldAnalyticsDetailedView
          offers={this.state.offers}
          product={this.state.product}
        />
      );
    } else {
      return null;
    }
  }
}
