import React from "react";
import { Modal, Input } from "antd";

class BolConfirmView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Modal
        title="Add your Bol credentials"
        visible={this.props.visible}
        onOk={this.props.handleSubmit}
        confirmLoading={this.props.confirmLoading}
        onCancel={this.props.handleCancel}
      >
        {" "}
        <span>Shop name</span>
        <Input
          style={{ marginTop: 5, marginBottom: 5 }}
          placeholder="fill in your shop name"
          onChange={this.props.handleShopName}
          value={this.props.shopName || this.props.user.bol_shop_name}
        />
        <span>Client ID</span>
        <Input
          style={{ marginTop: 5, marginBottom: 5 }}
          placeholder="fill in your Client ID"
          onChange={this.props.handleClientId}
          value={this.props.clientId || this.props.user.bol_client_id}
        />
        <span>Client Secret</span>
        <Input
          style={{ marginTop: 5, marginBottom: 5 }}
          placeholder="fill in your Client Secret"
          onChange={this.props.handleClientSecret}
          value={this.props.clientSecret || this.props.user.bol_client_secret}
        />
      </Modal>
    );
  }
}
export default BolConfirmView;
