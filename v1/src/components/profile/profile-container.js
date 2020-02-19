import React from 'react';
import ProfileView from './profile-view';
import { updateUserInformation } from '../../utils/user';
export default class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.handleSubmitProfileEdit = this.handleSubmitProfileEdit.bind(this);
  }

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  handleSubmitProfileEdit = async () => {
    const response = await updateUserInformation({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      zip: this.state.zip
    });
  };
  render() {
    return (
      <ProfileView
        {...this.props}
        onChange={this.onChange}
        handleSubmitProfileEdit={this.handleSubmitProfileEdit}
      />
    );
  }
}
