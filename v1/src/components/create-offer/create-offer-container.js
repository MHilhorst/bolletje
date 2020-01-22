import React from 'react';
import CreateOfferView from './create-offer-view';
import { createOffer } from '../../utils/bol';
export default class CreateOfferContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ean: '',
      condition: 'NEW',
      price: 0,
      stockAmount: 0,
      fulfilment: '24uurs-23',
      loadingPostOffer: false,
      postOfferError: null,
      postOfferSuccess: null
    };
    this.handleEAN = this.handleEAN.bind(this);
    this.handleCondition = this.handleCondition.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleStockAmount = this.handleStockAmount.bind(this);
    this.handleFulfilment = this.handleFulfilment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit = async () => {
    this.setState({ loadingPostOffer: true });
    const offer = await createOffer(
      this.state.ean,
      this.state.condition,
      this.state.price,
      this.state.stockAmount,
      this.state.fulfilment
    );
    if (offer.error) {
      this.setState({ loadingPostOffer: false, postOfferError: true });
    } else {
      this.setState({ loadingPostOffer: false, postOfferSuccess: true });
    }
  };
  handleEAN = e => {
    this.setState({
      ean: e.target.value,
      postOfferError: null,
      postOfferSuccess: null
    });
  };
  handleCondition = condition => {
    this.setState({
      condition: condition,
      postOfferError: null,
      postOfferSuccess: null
    });
  };
  handlePrice = e => {
    this.setState({ price: e.target.value });
  };
  handleStockAmount = e => {
    this.setState({
      stockAmount: e.target.value,
      postOfferError: null,
      postOfferSuccess: null
    });
  };
  handleFulfilment = fulfilment => {
    this.setState({
      fulfilment: fulfilment,
      postOfferError: null,
      postOfferSuccess: null
    });
  };
  render() {
    return (
      <CreateOfferView
        handleCondition={this.handleCondition}
        handleEAN={this.handleEAN}
        handleFulfilment={this.handleFulfilment}
        handleStockAmount={this.handleStockAmount}
        handlePrice={this.handlePrice}
        handleSubmit={this.handleSubmit}
        loadingPostOffer={this.state.loadingPostOffer}
        postOfferError={this.state.postOfferError}
        postOfferSuccess={this.state.postOfferSuccess}
      />
    );
  }
}
