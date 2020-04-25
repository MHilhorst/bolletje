import React from 'react';
import ProfileView from './profile-view';
import { updateUserInformation } from '../../utils/user';
import { upgradeAccount } from '../../utils/auth';
export default class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorSubscriptionSelection: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmitProfileEdit = this.handleSubmitProfileEdit.bind(this);
    this.handleUpgrade = this.handleUpgrade.bind(this);
  }

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  handleSubmitProfileEdit = async () => {
    const toUpdate = {};
    if (this.state.firstName) toUpdate.firstName = this.state.firstName;
    if (this.state.lastName) toUpdate.lastName = this.state.lastName;
    if (this.state.address) toUpdate.address = this.state.address;
    if (this.state.zip) toUpdate.zip = this.state.zip;
    if (this.state.email) toUpdate.email = this.state.email;
    if (
      this.state.oldPass &&
      this.state.newPass === this.state.newVerifyPass &&
      this.state.newPass.length > 0 &&
      this.state.newVerifyPass.length > 0
    )
      toUpdate.password = this.state.newPass;
    await updateUserInformation(toUpdate);
  };
  handleUpgrade = async () => {
    const data = await upgradeAccount({
      accountType: this.state.selectedAccountType,
    });
    if (data.error) {
      this.setState({ errorSubscriptionSelection: true });
    }
    if (data.url) {
      window.location.href = data.url;
    }
  };
  handleBolUpdate = async () => {
    const updateQuery = {};
    if (this.state.bolClientSecret)
      updateQuery.bol_client_secret = this.state.bolClientSecret;
    if (this.state.bolClientId)
      updateQuery.bol_client_id = this.state.bolClientId;
    if (this.state.bolShopName)
      updateQuery.bol_shop_name = this.state.bolShopName;
    await updateUserInformation(updateQuery);
  };
  render() {
    return (
      <ProfileView
        {...this.props}
        onChange={this.onChange}
        handleSubmitProfileEdit={this.handleSubmitProfileEdit}
        handleUpgrade={this.handleUpgrade}
        handleBolUpdate={this.handleBolUpdate}
        {...this.state}
      />
    );
  }
}
