import React from 'react';
import { Avatar, Icon, Drawer, Button, Dropdown, Menu, Typography } from 'antd';
import Cookies from 'js-cookie';
const { Text } = Typography;
class NavigationBarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  logout = () => {
    Cookies.remove('token');
  };
  menu = (
    <Menu>
      <Menu.Item key="0">
        <a target="_blank" href="http://www.alipay.com/">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={32} icon="user" />
            <div style={{ marginLeft: 10 }}>
              <Text strong style={{ marginBottom: 0, paddingBottom: 0 }}>
                {this.props.user._id}
              </Text>
              <span style={{ display: 'block', marginTop: 0, paddingTop: 0 }}>
                asdad
              </span>
            </div>
          </div>
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.taobao.com/"
        >
          Account
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.taobao.com/"
        >
          Log Out
        </a>
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
