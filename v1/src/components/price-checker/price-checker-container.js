import React from "react";
import PriceCheckerView from "./price-checker-view";
import { reloadOffers } from "../../utils/bol";

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
  }
  componentDidMount() {
    const offers = JSON.parse(localStorage.getItem("offers"));
    const tableOffers = JSON.parse(localStorage.getItem("tableOffers"));
    console.log(this.props.user);
    this.setState({ offers, tableOffers });
  }
  handleReloadOffers = async () => {
    this.setState({ loadingOffers: true });
    const offers = await reloadOffers();
    console.log(offers);
    if (offers) {
      const offerTableSchema = [];
      let offerKey = 0;
      offers.result.map(offer => {
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
          offerRank: currentRank
        });
      });
      if (offers.result.length >= 1) {
        this.setState({
          offers: offers.result,
          tableOffers: offerTableSchema,
          loadingOffers: false
        });
        localStorage.setItem("offers", JSON.stringify(this.state.offers));
        localStorage.setItem(
          "tableOffers",
          JSON.stringify(this.state.tableOffers)
        );
      }
    }
  };
  render() {
    return (
      <PriceCheckerView
        handleReloadOffers={this.handleReloadOffers}
        offers={this.state.offers}
        tableOffers={this.state.tableOffers}
      />
    );
  }
}
