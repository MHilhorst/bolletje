import React from "react";
import BolItemView from "./bol-item-view";
import {
  getCommission,
  updateAutoOffer,
  getBolOffers,
  findSeller
} from "../../../utils/bol";
import {
  deleteBolOfferOfInventoryItem,
  setBolOfferOfInventoryItem,
  getBolOfferOfInventoryItem
} from "../../../utils/inventory";

const getBuyBox = async (offers, user) => {
  const ownOfferIndex = offers.findIndex(offer => {
    return offer.seller.displayName === user.bol_shop_name;
  });
  if (offers[ownOfferIndex].bestOffer) {
    return true;
  } else {
    return false;
  }
};

export default class BolItemContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleCommission = this.handleCommission.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  async componentDidMount() {
    if (this.props.inventoryItem.bol_id) {
      const data = await getBolOfferOfInventoryItem(
        this.props.inventoryItem.bol_id
      );
      const tableData = [];
      const currentRank = findSeller(
        data.result.offerData.offers,
        this.props.user
      );
      let buyBox;
      try {
        buyBox = await getBuyBox(data.result.offerData.offers, this.props.user);
      } catch {}

      tableData.push({
        key: 1,
        productName: data.result.store.productTitle,
        ean: data.result.ean,
        currentPrice: data.result.pricing.bundlePrices[0].price,
        currentStock: data.result.stock.amount,
        totalSellers: data.result.offerData.offers.length,
        offerRank: currentRank,
        offerInfo: data.result,
        buyBox: buyBox || "",
        liveTracking: data.result.bolOffer.auto_track
      });
      this.setState({
        tableData,
        bolOffer: data.result,
        autoPriceChanger: data.result.bolOffer.auto_track,
        priceUpdate: data.result.pricing.bundlePrices[0].price,
        minProfit: data.result.bolOffer.min_profit,
        minListingPrice: data.result.bolOffer.min_listing_price,
        additionalCosts: data.result.bolOffer.additional_costs,
        priceChangeAmount: data.result.bolOffer.price_change_amount,
        stockUpdate: data.result.stock.amount
      });
    }
  }
  handleCommission = async (ean, price, minListing) => {
    if (!minListing) {
      const commission = await getCommission(ean, price);
      this.setState({
        bolReceivePrice: commission.totalCost,
        bolCommissionPercentage: commission.percentage,
        commissionReduction: commission.hasOwnProperty("reductions")
          ? commission.reductions[0]
          : false
      });
    } else {
      const commission = await getCommission(ean, price);
      this.setState({
        minListingCommission: commission.totalCost
      });
    }
  };
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = async bolOfferId => {
    const data = {
      bolOfferId
    };
    if (typeof this.state.autoPriceChanger !== "undefined")
      data.autoTrack = this.state.autoPriceChanger;
    if (this.state.minProfit) data.minProfit = this.state.minProfit;
    if (this.state.minListingPrice)
      data.minListingPrice = this.state.minListingPrice;
    if (this.state.additionalCosts)
      data.additionalCosts = this.state.additionalCosts;
    if (this.state.priceUpdate) data.priceUpdate = this.state.priceUpdate;
    if (this.state.stockUpdate) data.stockUpdate = this.state.stockUpdate;
    if (this.state.priceChangeAmount)
      data.priceChangeAmount = this.state.priceChangeAmount;
    data.offerId = this.state.bolOffer.offer_id;
    const updated = await updateAutoOffer(data);
    if (updated) window.location.reload();
  };
  handleEditBol = async () => {
    const data = await deleteBolOfferOfInventoryItem(
      this.props.inventoryItem._id
    );
    window.location.reload();
  };
  handleBolOffers = async () => {
    const data = await getBolOffers();
    this.setState({ bolOffers: data.bolOffers });
  };
  saveSelectedBolOffer = async () => {
    const data = await setBolOfferOfInventoryItem(
      this.props.inventoryItem._id,
      this.state.bolId
    );
    window.location.reload();
  };
  render() {
    return (
      <BolItemView
        {...this.props}
        {...this.state}
        handleCommission={this.handleCommission}
        handleSubmit={this.handleSubmit}
        onChange={this.onChange}
        saveSelectedBolOffer={this.saveSelectedBolOffer}
        handleEditBol={this.handleEditBol}
        handleBolOffers={this.handleBolOffers}
      />
    );
  }
}
