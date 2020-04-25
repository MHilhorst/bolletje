import React from 'react';
import { Tag, Descriptions, Timeline } from 'antd';
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
              {this.props.childUser.subscription.account_type === 'MEDIUM' ? (
                <Tag color="blue">MEDIUM</Tag>
              ) : this.props.childUser.subscription.account_type === 'SMALL' ? (
                <Tag color="orange">SMALL</Tag>
              ) : (
                <Tag color="green">TRIAL</Tag>
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
                    <a href={`/admin/products/${item}`}>{item}</a>
                    <br />
                  </>
                );
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Max Track Items" span={3}>
              {this.props.childUser.max_track_items}
            </Descriptions.Item>
            <Descriptions.Item label="Repricer Offers" span={3}>
              {this.props.childUser.own_offers.map((offer) => {
                return <a href={`/admin/repricer-offers/${offer}`}>{offer}</a>;
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Repricer Updates" span={3}>
              <Timeline>
                {this.props.childUser.status.updates.map((update) => {
                  return (
                    <Timeline.Item>
                      <span>{update.id}</span>
                      <br />
                      <span>
                        {new Date(
                          new Date(update.timestamp).getTime()
                        ).toString()}
                      </span>
                      <br />
                      <Tag
                        color={update.status === 'SUCCESS' ? 'green' : 'red'}
                      >
                        {update.status}
                      </Tag>
                      <br />
                      <span>{update.entity_id}</span>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </Descriptions.Item>
          </Descriptions>
        </Box>
      </>
    );
  }
}
