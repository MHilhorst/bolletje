import React from "react";
import ProductSoldAnalyticsDetailedView from "./product-sold-analytics-detailed-view";
import { getOfferTrackInfo } from "../../utils/bol";
export default class ProductSoldAnalyticsDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackOfferInfo: null
    };
  }
  async componentDidMount() {
    const trackOfferInfo = await getOfferTrackInfo(1001033596665131);
    this.setState({ trackOfferInfo: trackOfferInfo.doc });
  }
  render() {
    if (this.state.trackOfferInfo) {
      return (
        <ProductSoldAnalyticsDetailedView
          trackOfferInfo={this.state.trackOfferInfo}
        />
      );
    } else {
      return null;
    }
  }
}
