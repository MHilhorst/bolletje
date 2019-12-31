import React from 'react';
import ProductSoldAnalyticsDetailedView from './product-sold-analytics-detailed-view';
import { getOffersTrackInfoOfProduct } from '../../utils/bol';
export default class ProductSoldAnalyticsDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: null
    };
  }
  async componentDidMount() {
    const id = this.props.match.params.id;
    const offers = await getOffersTrackInfoOfProduct(id);
    this.setState({ offers: offers });
  }
  render() {
    if (this.state.offers) {
      return <ProductSoldAnalyticsDetailedView offers={this.state.offers} />;
    } else {
      return null;
    }
  }
}
