import React from "react";
import ProductSoldAnalyticsDetailedView from "./product-sold-analytics-detailed-view";
import {
  getOffersTrackInfoOfProduct,
  getTrackedProduct,
  getCommission
} from "../../utils/bol";
export default class ProductSoldAnalyticsDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: null,
      product: null,
      packagingCosts: 0,
      productCosts: 0
    };
    this.onChange = this.onChange.bind(this);
    this.handleCommission = this.handleCommission.bind(this);
  }
  handleCommission = async (ean, price) => {
    const commission = await getCommission(ean, price);
    this.setState({
      bolReceivePrice: commission.totalCost,
      bolCommissionPercentage: commission.percentage,
      commissionReduction: commission.hasOwnProperty("reductions")
        ? commission.reductions[0]
        : false
    });
  };
  async componentDidMount() {
    const id = this.props.match.params.id;
    const offers = await getOffersTrackInfoOfProduct(id);
    const product = await getTrackedProduct(id);
    this.setState({ offers: offers, product });
  }
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  render() {
    if (this.state.offers && this.state.product) {
      return (
        <ProductSoldAnalyticsDetailedView
          offers={this.state.offers}
          product={this.state.product}
          onChange={this.onChange}
          handleCommission={this.handleCommission}
          {...this.state}
        />
      );
    } else {
      return null;
    }
  }
}
