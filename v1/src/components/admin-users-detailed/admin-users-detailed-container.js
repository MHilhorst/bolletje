import React from 'react';
import AdminUsersDetailedView from './admin-users-detailed-view';
import { getUser } from '../../utils/admin';
import Loading from '../loading';

export default class AdminUsersDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  async componentDidMount() {
    const data = await getUser(this.props.match.params.id);
    console.log(data);
    this.setState({ childUser: data.user, loading: false });
  }
  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return <AdminUsersDetailedView {...this.props} {...this.state} />;
    }
  }
}
