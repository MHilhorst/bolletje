import React from 'react';
import ProductManagementView from './product-management-view';
import { checkOffer } from '../../utils/auth';
export default class ProductManagementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    const ownOfferId = this.props.location.pathname.split('/')[2];
    const offerVerified = await checkOffer(ownOfferId);
    this.setState({ offer: offerVerified.userOffer });
  }
  render() {
    return <ProductManagementView {...this.props} {...this.state} />;
  }
}
