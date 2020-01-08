import React from 'react';
import PriceCheckerView from './price-checker-view';
import {
  reloadOffers,
  updateAutoOffer,
  getUserOwnOffers,
  getCommission
} from '../../utils/bol';

const findSeller = (array, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].seller.displayName === value) {
      return i;
    }
  }
  return -1;
};

export default class PriceCheckerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      loadingOffers: false,
      tableOffers: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = async autoOfferId => {
    const data = {
      autoOfferId
    };
    if (typeof this.state.autoPriceChanger !== 'undefined')
      data.autoTrack = this.state.autoPriceChanger;
    if (this.state.minProfit) data.minProfit = this.state.minProfit;
    if (this.state.minListingPrice)
      data.minListingPrice = this.state.minListingPrice;
    if (this.state.additionalCosts)
      data.additionalCosts = this.state.additionalCosts;
    if (this.state.priceUpdate) data.priceUpdate = this.state.priceUpdate;
    if (this.state.stockUpdate) data.stockUpdate = this.state.stockUpdate;
    data.offerId = this.state.currentOfferId;
    updateAutoOffer(data);
  };

  async componentDidMount() {
    const offerTableSchema = [];
    let offerKey = 0;
    const offers = await getUserOwnOffers();
    offers.result.map(offer => {
      console.log(offer);
      const currentRank = findSeller(
        offer.offerData.offers,
        this.props.user.bol_shop_name
      );
      offerKey += 1;
      offerTableSchema.push({
        key: offerKey,
        productName: offer.store.productTitle,
        ean: offer.ean,
        currentPrice: offer.pricing.bundlePrices[0].price,
        currentStock: offer.stock.amount,
        totalSellers: offer.offerData.offers.length,
        offerRank: currentRank,
        offerInfo: offer,
        liveTracking: offer.autoOffer.auto_track
      });
    });
    if (offers.result.length >= 1) {
      this.setState({
        offers: offers.result,
        tableOffers: offerTableSchema,
        loadingOffers: false
      });
    }
  }
  handleCommission = async (ean, price, minListing) => {
    if (!minListing) {
      const commission = await getCommission(ean, price);
      this.setState({
        bolReceivePrice: commission.totalCost,
        bolCommissionPercentage: commission.percentage,
        commissionReduction: commission.reductions[0]
      });
    } else {
      const commission = await getCommission(ean, price);
      this.setState({
        minListingCommission: commission.totalCost
      });
    }
  };
  handleReloadOffers = async () => {
    this.setState({ loadingOffers: true });
    const offers = await reloadOffers();
    if (offers) {
      const offerTableSchema = [];
      let offerKey = 0;
      offers.result.map(offer => {
        console.log(offer);
        const currentRank = findSeller(
          offer.offerData.offers,
          this.props.user.bol_shop_name
        );
        offerKey += 1;
        offerTableSchema.push({
          key: offerKey,
          productName: offer.store.productTitle,
          ean: offer.ean,
          currentPrice: offer.pricing.bundlePrices[0].price,
          currentStock: offer.stock.amount,
          totalSellers: offer.offerData.offers.length,
          offerRank: currentRank,
          offerInfo: offer
        });
      });
      if (offers.result.length >= 1) {
        this.setState({
          offers: offers.result,
          tableOffers: offerTableSchema,
          loadingOffers: false
        });
        // localStorage.setItem("offers", JSON.stringify(this.state.offers));
        // localStorage.setItem(
        //   "tableOffers",
        //   JSON.stringify(this.state.tableOffers)
        // );
      }
    }
  };
  render() {
    return (
      <PriceCheckerView
        handleReloadOffers={this.handleReloadOffers}
        onChange={this.onChange}
        handleSubmit={this.handleSubmit}
        handleCommission={this.handleCommission}
        {...this.state}
      />
    );
  }
}
