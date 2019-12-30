import React from "react";
import { Box } from "../../styles/style";
import BolConfirmModal from "./bol-confirm";
import { Button } from "antd";
class DashboardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleBolModal: false
    };
  }
  handleBolConfirm = () => {
    this.setState({ visibleBolModal: true });
  };
  handleCancel = () => {
    this.setState({ visibleBolModal: false });
  };

  render() {
    return (
      <>
        <BolConfirmModal
          visible={this.state.visibleBolModal}
          handleCancel={this.handleCancel}
          user={this.props.user}
        />
        <Box>
          {this.props.user.bol_client_secret &&
            this.props.user.bol_client_id && (
              <Button onClick={this.handleBolConfirm}>
                Update Bol.com credentials
              </Button>
            )}
          {!this.props.user.bol_client_secret &&
            !this.props.user.bol_client_id && (
              <Button onClick={this.handleBolConfirm} type="primary">
                Add your credentials
              </Button>
            )}
        </Box>

        <Box>asd</Box>
      </>
    );
  }
}

export default DashboardView;
