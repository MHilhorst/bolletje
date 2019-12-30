import React from "react";
import { Layout, Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import { HeaderLogo } from "../../styles/style";
import NavigationBar from "../../components/navigation-bar";
const { Sider, Header, Content } = Layout;

class BaseLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }
  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <HeaderLogo>
            {!this.state.collapsed && (
              <img
                src={require("../../assets/images/logo.png")}
                style={{ maxHeight: "100%", maxWidth: "50%" }}
              />
            )}
            {this.state.collapsed && (
              <img
                src={require("../../assets/images/smalLogo.png")}
                style={{ maxHeight: "100%", maxWidth: "50%" }}
              />
            )}
          </HeaderLogo>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" onClick={() => this.props.history.push("/")}>
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => this.props.history.push("/search-analytics")}
            >
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => this.props.history.push("/profile")}
            >
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={() => this.props.history.push("/product-sold-analytics")}
            >
              <Icon type="upload" />
              <span>nav 4</span>
            </Menu.Item>
            <Menu.Item
              key="5"
              onClick={() => this.props.history.push("/price-checker")}
            >
              <Icon type="upload" />
              <span>nav 5</span>
            </Menu.Item>
            <Menu.Item
              key="6"
              onClick={() => this.props.history.push("/create-offer")}
            >
              <Icon type="upload" />
              <span>Create Offer</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: "#fff",
              paddingLeft: 24,
              paddingRight: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.onCollapse}
            />
            <NavigationBar {...this.props} />
          </Header>
          <Content
            style={{
              margin: "0px 16px"
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BaseLayout;
