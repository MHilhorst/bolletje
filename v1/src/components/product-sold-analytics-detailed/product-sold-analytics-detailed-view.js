import React from 'react';
import { Box } from '../../styles/style';
import Offer from './offer/offer-view';

export default class ProductSoldAnalyticsDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}
  render() {
    return (
      <Box>
        <Offer offer={this.props.offers[0]} />
      </Box>
    );
  }
}
