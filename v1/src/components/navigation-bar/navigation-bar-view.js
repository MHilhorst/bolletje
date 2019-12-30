import React from "react";
import { Avatar, Icon, Drawer, Button } from "antd";
import Cookies from "js-cookie";
class NavigationBarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  componentDidMount() {
    console.log(this.props.user);
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  logout = () => {
    Cookies.remove("token");
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false
    });
  };
  render() {
    return (
      <div>
        <Avatar
          icon="user"
          style={{ cursor: "pointer" }}
          onClick={this.showDrawer}
        />
        <Drawer
          title="Multi-level drawer"
          width={520}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Button type="primary" onClick={this.showChildrenDrawer}>
            Two-level drawer
          </Button>
          <Drawer
            title="Two-level Drawer"
            width={320}
            closable={false}
            onClose={this.onChildrenDrawerClose}
            visible={this.state.childrenDrawer}
          >
            This is two-level drawer
          </Drawer>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e8e8e8",
              padding: "10px 16px",
              textAlign: "right",
              left: 0,
              background: "#fff",
              borderRadius: "0 0 4px 4px"
            }}
          >
            <Button
              style={{
                marginRight: 8
              }}
              onClick={this.onClose}
            >
              Cancel
            </Button>
            <Button onClick={this.logout} type="primary">
              Logout
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default NavigationBarView;
