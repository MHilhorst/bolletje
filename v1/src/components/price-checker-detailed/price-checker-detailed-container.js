import React from 'react';
import PriceCheckerDetailedView from './price-checker-detailed-view';
import { getRepricerOffer, updateRepricerOffer } from '../../utils/repricer';

export default class PriceCheckerDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.onChange = this.onChange.bind(this);
  }
  async componentDidMount() {
    const data = await getRepricerOffer(this.props.match.params.id);
    const competitorData = data.repricerOffer.offers_visible.map((offer) => {
      return {
        price: offer.price,
        availabilityCode: offer.availabilityCode,
        score: offer.seller.sellerRating.sellerRating,
        sellerName: offer.seller.displayName,
        deliveryTime: offer.seller,
        id: offer.id,
      };
    });
    this.setState({
      offer: data.repricerOffer,
      loading: false,
      competitorData,
      selectedCompetitorsOffers: data.repricerOffer.selected_competitors,
    });
  }

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  saveSelectedCompetitors = async () => {
    const data = await updateRepricerOffer(
      {
        selectedCompetitors: this.state.selectedCompetitorsOffers,
      },
      this.props.match.params.id
    );
    if (data) {
      console.log(data);
    }
  };
  saveCustomSelectionCompetitors = async (e) => {
    const data = await updateRepricerOffer(
      {
        customSelectionCompetitors: e,
      },
      this.props.match.params.id
    );
    if (data) {
      console.log(data);
      this.setState({ customSelectionCompetitors: e });
    }
  };
  render() {
    if (!this.state.loading) {
      return (
        <PriceCheckerDetailedView
          {...this.state}
          onChange={this.onChange}
          saveSelectedCompetitors={this.saveSelectedCompetitors}
          saveCustomSelectionCompetitors={this.saveCustomSelectionCompetitors}
          {...this.props}
        />
      );
    }
    return null;
  }
}
