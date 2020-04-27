import React from 'react';
import { Avatar, Dropdown, Menu, Typography, Tag } from 'antd';
import Cookies from 'js-cookie';
import { userLogout } from '../../utils/auth';
const { Text } = Typography;
class NavigationBarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  logout = () => {
    console.log('logging out');
    if (userLogout()) {
      Cookies.remove('token', { path: '/', domain: 'localhost' });
      // this.props.history.replace('/login');
      window.location.reload();
    }
  };
  menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/profile">
          <div style={{ display: 'flex', alignItems: 'center', width: 180 }}>
            <Avatar size={32} icon="user" />
            <div style={{ marginLeft: 10, marginTop: 4, marginBottom: 4 }}>
              <Text strong style={{ marginBottom: 0, paddingBottom: 0 }}>
                {this.props.user.first_name.length < 14
                  ? this.props.user.first_name
                  : this.props.user.first_name.substr(0, 14) + '...'}{' '}
                {this.props.user.subscription.account_type === 'MEDIUM' ? (
                  <Tag color="blue">MEDIUM</Tag>
                ) : this.props.user.subscription.account_type === 'SMALL' ? (
                  <Tag color="orange">SMALL</Tag>
                ) : (
                  <Tag color="green">TRIAL</Tag>
                )}
              </Text>
              <span style={{ display: 'block', marginTop: 0, paddingTop: 0 }}>
                {this.props.user.email.length < 18
                  ? this.props.user.email
                  : this.props.user.email.substr(0, 18) + '...'}
              </span>
            </div>
          </div>
        </a>
      </Menu.Item>
      <Menu.Divider />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 10,
        }}
      >
        <Tag color="green" style={{ marginTop: 4, marginBottom: 4 }}>
          {this.props.user.bol_track_items.length}/
          {this.props.user.subscription.max_track_items}
        </Tag>
        <span>Items tracked</span>
      </div>
      <Menu.Divider />
      <Menu.Item key="1">
        <a rel="noopener noreferrer" href="/profile">
          Account
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <span target="_blank" rel="noopener noreferrer" onClick={this.logout}>
          Log Out
        </span>
      </Menu.Item>
    </Menu>
  );
  render() {
    return (
      <div>
        <Dropdown overlay={this.menu}>
          <Avatar
            icon="user"
            style={{ cursor: 'pointer' }}
            onClick={this.showDrawer}
          />
        </Dropdown>
      </div>
    );
  }
}

export default NavigationBarView;
