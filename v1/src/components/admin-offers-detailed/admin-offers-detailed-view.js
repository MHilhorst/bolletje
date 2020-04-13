import React from 'react';
import { Descriptions, Timeline } from 'antd';
import { Box } from '../../styles/style';

export default class AdminOffersDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <Box>
          <Descriptions title={this.props.offer._id} bordered>
            <Descriptions.Item label="Public Offer ID" span={3}>
              {this.props.offer.public_offer_id}
            </Descriptions.Item>
            <Descriptions.Item label="Created" span={3}>
              {new Date(
                new Date(this.props.offer.created).getTime()
              ).toString()}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity" span={3}>
              {this.props.offer.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Seller ID" span={3}>
              {this.props.offer.seller_id}
            </Descriptions.Item>
            <Descriptions.Item label="Seller Display Name" span={3}>
              {this.props.offer.seller_display_name}
            </Descriptions.Item>
            <Descriptions.Item label="Seller Object" span={3}>
              {JSON.stringify(this.props.offer.seller)}
            </Descriptions.Item>
            <Descriptions.Item label="Product ID" span={3}>
              <a
                href={`/product-sold-analytics/${this.props.offer.product_id}`}
              >
                {this.props.offer.product_id}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Updates Length" span={3}>
              {this.props.offer.updates.length}
            </Descriptions.Item>
            <Descriptions.Item label="Last Update" span={3}>
              {new Date(
                new Date(
                  this.props.offer.updates[
                    this.props.offer.updates.length - 1
                  ].time_checked
                ).getTime()
              ).toString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updates" span={3}>
              <Timeline>
                {this.props.offer.updates.length > 10
                  ? this.props.offer.updates
                      .slice(
                        this.props.offer.updates.length - 10,
                        this.props.offer.updates.length
                      )
                      .map((update) => {
                        return (
                          <Timeline.Item>
                            <span>
                              {new Date(
                                new Date(update.time_checked).getTime()
                              ).toString()}
                            </span>
                            <br />
                            <span>{update.quantity}</span>
                            <br />
                            <span>{update.quantitySoldSincePrevious}</span>
                            <br />
                            <span>{update.price}</span>
                            <br />
                          </Timeline.Item>
                        );
                      })
                  : this.props.offer.updates.map((update) => {
                      return (
                        <Timeline.Item>
                          <span>
                            {new Date(
                              new Date(update.time_checked).getTime()
                            ).toString()}
                          </span>
                          <br />
                          <span>{update.quantity}</span>
                          <br />
                          <span>{update.quantitySoldSincePrevious}</span>
                          <br />
                          <span>{update.price}</span>
                          <br />
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
