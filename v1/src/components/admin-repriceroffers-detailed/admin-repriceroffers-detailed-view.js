import React from 'react';
import { Descriptions } from 'antd';
import { Box } from '../../styles/style';

export default class AdminRepricerOffersView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <Box>
          <Descriptions title={this.props.repricerOffer.offer_id} bordered>
            <Descriptions.Item label="public_offer_id" span={3}>
              {this.props.repricerOffer.public_offer_id}
            </Descriptions.Item>
            <Descriptions.Item label="internal_id" span={3}>
              {this.props.repricerOffer._id}
            </Descriptions.Item>
            <Descriptions.Item label="offer_id" span={3}>
              {this.props.repricerOffer.offer_id}
            </Descriptions.Item>
            <Descriptions.Item label="ean" span={3}>
              {this.props.repricerOffer.ean}
            </Descriptions.Item>
            <Descriptions.Item label="user_id" span={3}>
              {this.props.repricerOffer.user_id}
            </Descriptions.Item>
            <Descriptions.Item label="stock" span={3}>
              {this.props.repricerOffer.stock}
            </Descriptions.Item>
            <Descriptions.Item label="repricer_active" span={3}>
              {this.props.repricerOffer.repricer_active}
            </Descriptions.Item>
            <Descriptions.Item label="bol_active" span={3}>
              {this.props.repricerOffer.bol_active}
            </Descriptions.Item>
            <Descriptions.Item label="price" span={3}>
              {this.props.repricerOffer.price}
            </Descriptions.Item>
            <Descriptions.Item label="total_sellers" span={3}>
              {this.props.repricerOffer.total_sellers}
            </Descriptions.Item>
            <Descriptions.Item label="best_offer" span={3}>
              {this.props.repricerOffer.best_offer}
            </Descriptions.Item>
            <Descriptions.Item label="offers_visible" span={3}>
              {/* {this.props.repricerOffer.offers_visible} */}
            </Descriptions.Item>
            <Descriptions.Item label="product_title" span={3}>
              {this.props.repricerOffer.product_title}
            </Descriptions.Item>
            <Descriptions.Item label="created" span={3}>
              {this.props.repricerOffer.created}
            </Descriptions.Item>
            <Descriptions.Item label="product_id" span={3}>
              {this.props.repricerOffer.product_id}
            </Descriptions.Item>
            <Descriptions.Item label="last_update" span={3}>
              {this.props.repricerOffer.last_update}
            </Descriptions.Item>
            <Descriptions.Item label="updates" span={3}>
              {/* {this.props.repricerOffer.updates[
                (this.props.repricerOffer.length - 10 < 0
                  ? 0
                  : this.props.repricerOffer.length - 10,
                this.props.repricerOffer.length)
              ].map((update) => {
                return <span>{update.timestamp}</span>;
              })} */}
            </Descriptions.Item>
          </Descriptions>
        </Box>
      </>
    );
  }
}
