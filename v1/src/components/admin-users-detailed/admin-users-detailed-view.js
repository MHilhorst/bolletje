import React from 'react';
import { Tag, Descriptions } from 'antd';
import { Box } from '../../styles/style';

export default class AdminUsersDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <Box>
          <Descriptions title={this.props.childUser._id} bordered>
            <Descriptions.Item label="First Name" span={3}>
              {this.props.childUser.first_name}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name" span={3}>
              {this.props.childUser.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={3}>
              {this.props.childUser.address}
            </Descriptions.Item>
            <Descriptions.Item label="Zip" span={3}>
              {this.props.childUser.zip}
            </Descriptions.Item>
            <Descriptions.Item label="Account Type" span={3}>
              {this.props.childUser.premium_account ? (
                <Tag color="orange">Premium</Tag>
              ) : (
                <Tag color="green">Trial</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail" span={3}>
              {this.props.childUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Bol Client ID" span={3}>
              {this.props.childUser.bol_client_id}
            </Descriptions.Item>
            <Descriptions.Item label="Bol Client Secret" span={3}>
              {this.props.childUser.bol_client_secret}
            </Descriptions.Item>
            <Descriptions.Item label="Bol Shop Name" span={3}>
              {this.props.childUser.bol_shop_name}
            </Descriptions.Item>
            <Descriptions.Item label="Last login" span={3}>
              {this.props.childUser.last_update_access_token}
            </Descriptions.Item>
            <Descriptions.Item label="Bol Trackings" span={3}>
              {this.props.childUser.bol_track_items.map((item) => {
                return (
                  <>
                    <span>{item}</span>
                    <br />
                  </>
                );
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Max Track Items" span={3}>
              {this.props.childUser.max_track_items}
            </Descriptions.Item>
          </Descriptions>
        </Box>
      </>
    );
  }
}
