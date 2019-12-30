import React from "react";

export default class OfferItemView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (this.props.offer) {
      return <>{this.props.offer.store.productTitle}</>;
    } else {
      return null;
    }
  }
}
