import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { HeaderLogo } from '../../styles/style';
import NavigationBar from '../../components/navigation-bar';
const { Sider, Header, Content } = Layout;
const { SubMenu } = Menu;
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
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <HeaderLogo>
            {!this.state.collapsed && (
              <img
                src={require('../../assets/images/logo.png')}
                style={{ maxHeight: '100%', maxWidth: '50%' }}
                alt={'mock'}
              />
            )}
            {this.state.collapsed && (
              <img
                src={require('../../assets/images/smalLogo.png')}
                style={{ maxHeight: '100%', maxWidth: '50%' }}
                alt={'mock'}
              />
            )}
          </HeaderLogo>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item
              key="1"
              onClick={() => this.props.history.push('/dashboard')}
            >
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>

            <Menu.Item
              key="4"
              onClick={() => this.props.history.push('/product-sold-analytics')}
            >
              <Icon type="monitor" />
              <span>Product Analytics</span>
            </Menu.Item>
            {/* <Menu.Item
              key="5"
              onClick={() => this.props.history.push('/price-checker')}
            >
              <Icon type="control" />
              <span>Offer Management</span>
            </Menu.Item> */}
            <Menu.Item
              key="6"
              onClick={() => this.props.history.push('/create-offer')}
            >
              <Icon type="upload" />
              <span>Create Offer</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="container" />
                  <span>Orders</span>
                </span>
              }
            >
              <Menu.Item
                key="7"
                onClick={() => this.props.history.push('/orders')}
              >
                <Icon type="appstore" />
                <span>Overview</span>
              </Menu.Item>{' '}
              <Menu.Item
                key="8"
                onClick={() => this.props.history.push('/orders/configuration')}
              >
                <Icon type="setting" />
                <span>Configuration</span>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="import" />
                  <span>Inventory</span>
                </span>
              }
            >
              <Menu.Item
                key="9"
                onClick={() => this.props.history.push('/inventory-overview')}
              >
                <Icon type="hdd" />
                <span>Overview</span>
              </Menu.Item>
              <Menu.Item
                key="10"
                onClick={() =>
                  this.props.history.push('/inventory-overview/create')
                }
              >
                <Icon type="setting" />
                <span>Create Inventory Item</span>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="build" />
                  <span>Plugins</span>
                </span>
              }
            >
              {this.props.user.plugins.indexOf(a => a === 'aliexpress') ===
                -1 && (
                <Menu.Item
                  key="9"
                  onClick={() => this.props.history.push('/plugin/aliexpress')}
                >
                  <Icon type="alibaba" />
                  <span>AliExpress</span>
                </Menu.Item>
              )}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#fff',
              paddingLeft: 24,
              paddingRight: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.onCollapse}
            />
            <NavigationBar {...this.props} />
          </Header>
          <Content
            style={{
              margin: '0px 16px'
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
