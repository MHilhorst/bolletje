import React from 'react';
import AdminUsersDetailedView from './admin-users-detailed-view';
import { getUser, updateMaxItems } from '../../utils/admin';
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
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  handleUpdateMaxUpdate = async () => {
    const data = await updateMaxItems(
      this.state.childUser._id,
      this.state.maxItems
    );
    if (data.success) {
      window.location.reload();
    }
  };
  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <AdminUsersDetailedView
          {...this.props}
          {...this.state}
          handleUpdateMaxUpdate={this.handleUpdateMaxUpdate}
          onChange={this.onChange}
        />
      );
    }
  }
}
