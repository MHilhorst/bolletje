import React from 'react';
import PriceCheckerView from './price-checker-view';
import {
  reloadOffers,
  getUserOwnOffers,
  getCommission,
  updateOffers,
} from '../../utils/repricer';

export default class PriceCheckerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      loadingOffers: false,
      tableOffers: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = async () => {
    await updateOffers();
  };

  async componentDidMount() {
    const data = await getUserOwnOffers();
    console.log(data);
    const offerTableSchema = data.offers.map((offer, index) => {
      return {
        key: index,
        ean: offer.ean,
        productName: offer.product_title,
        totalSellers: offer.offers_visible.length,
        currentPrice: offer.price,
        currentStock: offer.stock,
      };
    });
    this.setState({ tableOffers: offerTableSchema });
  }

  handleCommission = async (ean, price, minListing) => {
    if (!minListing) {
      const commission = await getCommission(ean, price);
      this.setState({
        bolReceivePrice: commission.totalCost,
        bolCommissionPercentage: commission.percentage,
        commissionReduction: commission.hasOwnProperty('reductions')
          ? commission.reductions[0]
          : false,
      });
    } else {
      const commission = await getCommission(ean, price);
      this.setState({
        minListingCommission: commission.totalCost,
      });
    }
  };

  handleReloadOffers = async () => {
    this.setState({ loadingOffers: true });
    const offers = await reloadOffers();
    if (offers) {
      this.setState({ loadingOffers: false });
    }
  };

  render() {
    if (this.state.offers && this.state.tableOffers) {
      return (
        <PriceCheckerView
          handleReloadOffers={this.handleReloadOffers}
          onChange={this.onChange}
          handleSubmit={this.handleSubmit}
          handleCommission={this.handleCommission}
          {...this.state}
          {...this.props}
        />
      );
    } else return null;
  }
}
