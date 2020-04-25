import React from 'react';
import AdminView from './admin-view';
import { getUsers, getUserQuery } from '../../utils/admin';
import { throttle } from 'throttle-debounce';

export default class AdminContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changePagination = this.changePagination.bind(this);
    // this.setTableData = this.setTableData.bind(this);
    this.searchAccount = this.searchAccount.bind(this);
    this.autocompleteSearchThrottled = throttle(500, this.fetchUser);
  }
  async componentDidMount() {
    const users = await getUsers(window.location.search);
    this.setTableData(users.data);
    this.setState({ totalUsers: users.total_items });
  }
  fetchUser = async (user) => {
    const users = await getUserQuery(user);
    this.setTableData(users.data);
  };
  changePagination = async (e) => {
    this.props.history.push({ pathname: '/admin/users', search: `?page=${e}` });
    const users = await getUsers(window.location.search);
    this.setTableData(users.data);
  };
  setTableData = async (users) => {
    const tableData = users.map((user, index) => {
      return {
        key: index,
        userId: user._id,
        email: user.email,
        registrationDate: user.registration_timestamp,
        accountType: user.subscription.account_type,
        adminAccount: user.admin_account,
        itemTracked: `${user.bol_track_items.length}/${user.max_track_items}`,
      };
    });
    this.setState({ tableData });
  };
  searchAccount = (value) => {
    this.setState({ accountQuery: value }, () => {
      this.autocompleteSearchThrottled(this.state.accountQuery);
    });
  };
  render() {
    return (
      <AdminView
        {...this.props}
        changePagination={this.changePagination}
        searchAccount={this.searchAccount}
        {...this.state}
      />
    );
  }
}
