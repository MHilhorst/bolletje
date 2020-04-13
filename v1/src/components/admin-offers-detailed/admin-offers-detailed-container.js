import React from 'react';
import AdminOffersDetailedView from './admin-offers-detailed-view';
import { getOffer } from '../../utils/admin';
import Loading from '../loading';

export default class AdminOffersDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  async componentDidMount() {
    const data = await getOffer(this.props.match.params.id);
    this.setState({ offer: data.offer, loading: false });
  }
  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return <AdminOffersDetailedView {...this.props} {...this.state} />;
    }
  }
}
