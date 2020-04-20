import React from 'react';
import AdminRepricerOffersView from './admin-repriceroffers-detailed-view';
import { getRepricerOffer } from '../../utils/admin';
import Loading from '../loading';

export default class AdminRepricerOffersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  async componentDidMount() {
    const data = await getRepricerOffer(this.props.match.params.id);
    console.log(data.offer);
    this.setState({ repricerOffer: data.offer, loading: false });
    console.log(this.state.repricerOffer);
  }
  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return <AdminRepricerOffersView {...this.props} {...this.state} />;
    }
  }
}
