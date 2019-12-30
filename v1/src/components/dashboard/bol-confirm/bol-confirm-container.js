import React from "react";
import BolConfirmView from "./bol-confirm-view";
import config from "../../../config";
import Cookies from "js-cookie";
class BolConfirmContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientSecret: "",
      clientId: "",
      shopName: "",
      confirmLoading: false
    };
    this.handleClientId = this.handleClientId.bind(this);
    this.handleClientSecret = this.handleClientSecret.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleClientSecret = e => {
    this.setState({ clientSecret: e.target.value });
  };
  handleClientId = e => {
    this.setState({ clientId: e.target.value });
  };
  handleShopName = e => {
    this.setState({ shopName: e.target.value });
  };
  handleSubmit = () => {
    this.setState({ confirmLoading: true });
    const jwt = Cookies.get("token");
    if (jwt) {
      fetch(`${config.host}/api/user/`, {
        method: "POST",
        headers: {
          Authorization: jwt,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bol_client_secret: this.state.clientSecret,
          bol_client_id: this.state.clientId,
          bol_shop_name: this.state.shopName
        })
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ confirmLoading: false });
          this.props.handleCancel();
        });
    }
  };
  render() {
    return (
      <BolConfirmView
        {...this.props}
        handleClientSecret={this.handleClientSecret}
        handleShopName={this.handleShopName}
        handleClientId={this.handleClientId}
        handleSubmit={this.handleSubmit}
        confirmLoading={this.state.confirmLoading}
        clientId={this.state.clientId}
        clientSecret={this.state.clientSecret}
        shopName={this.state.shopName}
      />
    );
  }
}

export default BolConfirmContainer;
