import React from 'react';
import ProfileView from './profile-view';
import { updateUserInformation } from '../../utils/user';
import { upgradeAccount } from '../../utils/auth';
export default class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const url = await upgradeAccount();
    window.location.href = url.url;
  };
  render() {
    return (
      <ProfileView
        {...this.props}
        onChange={this.onChange}
        handleSubmitProfileEdit={this.handleSubmitProfileEdit}
        handleUpgrade={this.handleUpgrade}
        {...this.state}
      />
    );
  }
}
