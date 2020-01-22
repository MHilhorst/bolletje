import React from 'react';
import ProductManagementView from './product-management-view';
import { checkOffer } from '../../utils/auth';
import { Redirect } from 'react-router-dom';
export default class ProductManagementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  async componentDidMount() {
    const ownOfferId = this.props.location.pathname.split('/')[2];
    const offerVerified = await checkOffer(ownOfferId);
    console.log(offerVerified);
    this.setState({ offer: offerVerified.userOffer, loading: false });
  }
  render() {
    if (this.state.offer && !this.state.loading) {
      return <ProductManagementView {...this.props} {...this.state} />;
    }
    if (!this.state.offer && !this.state.loading) {
      return <Redirect to="/dashboard" />;
    } else {
      return null;
    }
  }
}
