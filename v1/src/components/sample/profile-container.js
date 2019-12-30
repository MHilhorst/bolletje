import React from "react";
import ProfileView from "./profile-view";

export default class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <ProfileView />;
  }
}
