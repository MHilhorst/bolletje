import React from 'react';
import { Layout, Menu, Icon, Tag } from 'antd';
import { HeaderLogo } from '../../styles/style';
import NavigationBar from '../../components/navigation-bar';
import { UndoOutlined } from '@ant-design/icons';
const { Sider, Header, Content } = Layout;
const { SubMenu } = Menu;
class BaseLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };
  componentDidMount() {
    if (window.location.pathname === '/dashboard') {
      this.setState({ current: 1 });
    } else if (window.location.pathname === '/product-sold-analytics') {
      this.setState({ current: 2 });
    } else if (window.location.pathname.includes('/product-sold-analytics')) {
      this.setState({ current: 2 });
    } else if (window.location.pathname === '/track-product') {
      this.setState({ current: 4 });
    } else if (window.location.pathname === '/product-checker') {
      this.setState({ current: 5 });
    }
  }
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          // style={{
          //   overflow: 'auto',
          //   height: '100vh',
          //   position: 'fixed',
          //   left: 0,
          // }}
        >
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
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                alt={'mock'}
              />
            )}
          </HeaderLogo>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            selectedKeys={[this.state.current]}
          >
            <Menu.Item
              key="1"
              onClick={() => this.props.history.push('/dashboard')}
            >
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>

            <SubMenu
              key="2"
              title={
                <span>
                  <Icon type="monitor" />
                  <span>Product Analytics</span>
                </span>
              }
            >
              <Menu.Item
                key="3"
                onClick={() =>
                  this.props.history.push('/product-sold-analytics')
                }
              >
                <Icon type="SearchOutlined" />
                <span>Overview</span>
              </Menu.Item>
              <Menu.Item
                key="4"
                onClick={() => this.props.history.push('/track-product')}
              >
                <Icon type="upload" />
                <span>Track New Product</span>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="5"
              title={
                <>
                  <UndoOutlined />
                  <span>RePricer </span>
                  {!this.state.collapsed && (
                    <Tag color="green" style={{}}>
                      BETA
                    </Tag>
                  )}
                </>
              }
            >
              <Menu.Item
                key="6"
                onClick={() => this.props.history.push('/price-checker')}
              >
                <UndoOutlined />
                <span>Overview </span>
              </Menu.Item>
              <Menu.Item
                key="7"
                onClick={() => this.props.history.push('/strategy-builder')}
              >
                <Icon type="upload" />
                <span>Strategy Builder</span>
              </Menu.Item>
            </SubMenu>

            {/* <Menu.Item
              key="5"
              onClick={() => this.props.history.push('/price-checker')}
            >
              <Icon type="control" />
              <span>Offer Management</span>
            </Menu.Item> */}
            {/* <Menu.Item
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
            </SubMenu> */}
            {/* <SubMenu
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
            </SubMenu> */}
            {this.props.user.admin_account && (
              <SubMenu
                key="8
                "
                title={
                  <span>
                    <Icon type="import" />
                    <span>Admin</span>
                  </span>
                }
              >
                <Menu.Item
                  key="9"
                  onClick={() =>
                    this.props.history.push({
                      pathname: '/admin/users',
                      search: '?page1',
                    })
                  }
                >
                  <Icon type="user" />
                  <span>Users</span>
                </Menu.Item>
                <Menu.Item
                  key="10"
                  onClick={() =>
                    this.props.history.push({
                      pathname: '/admin/products',
                      search: '?page1',
                    })
                  }
                >
                  <Icon type="gold" />
                  <span>Products</span>
                </Menu.Item>
                <Menu.Item
                  key="11"
                  onClick={() =>
                    this.props.history.push({
                      pathname: '/admin/dashboard',
                    })
                  }
                >
                  <Icon type="dashboard" />
                  <span>Dashboard</span>
                </Menu.Item>
              </SubMenu>
            )}
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          // style={{ marginLeft: this.state.collapsed ? 0 : 200 }}
        >
          <Header
            style={{
              background: '#fff',
              paddingLeft: 24,
              paddingRight: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
              margin: '0px 16px',
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
