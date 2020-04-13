import React from 'react';
import { Descriptions, Button, Divider } from 'antd';
import { Box } from '../../styles/style';
const getFormattedDate = (date) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  return month + '/' + day + '/' + year;
};

export default class AdminProductsDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleProductReload = () => {
    this.props.productReload();
  };
  render() {
    return (
      <>
        <Box>
          <Descriptions title={this.props.product._id} bordered>
            <Descriptions.Item label="Product ID" span={3}>
              <a
                href={`/product-sold-analytics/${this.props.product.product_id}`}
              >
                {this.props.product.product_id}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="EAN" span={3}>
              {this.props.product.ean}
            </Descriptions.Item>
            <Descriptions.Item label="title" span={3}>
              <a href={this.props.product.url}>{this.props.product.title}</a>
            </Descriptions.Item>
            <Descriptions.Item label="rating" span={3}>
              {this.props.product.rating}
            </Descriptions.Item>
            <Descriptions.Item label="total_sold" span={3}>
              {this.props.product.total_sold}
            </Descriptions.Item>
            <Descriptions.Item label="tracking since" span={3}>
              {getFormattedDate(new Date(this.props.product.tracking_since))}
            </Descriptions.Item>
            <Descriptions.Item label="Last Offer Check" span={3}>
              {Math.floor(
                (new Date().getTime() -
                  new Date(this.props.product.last_offer_check).getTime()) /
                  1000 /
                  60
              )}{' '}
              Minutes Ago - {this.props.product.last_offer_check}
            </Descriptions.Item>
            <Descriptions.Item label="Last Old Offer Wipe" span={3}>
              {Math.floor(
                (new Date().getTime() -
                  new Date(this.props.product.last_old_offer_wipe).getTime()) /
                  1000 /
                  60
              ) > 1440
                ? Math.floor(
                    (new Date().getTime() -
                      new Date(
                        this.props.product.last_old_offer_wipe
                      ).getTime()) /
                      1000 /
                      60 /
                      60
                  ) + ' Hours Ago'
                : Math.floor(
                    (new Date().getTime() -
                      new Date(
                        this.props.product.last_old_offer_wipe
                      ).getTime()) /
                      1000 /
                      60 +
                      ' Minutes Ago'
                  )}{' '}
              {this.props.product.last_old_offer_wipe}
            </Descriptions.Item>
            <Descriptions.Item label="Users Tracking" span={3}>
              {this.props.product.users_tracking.map((user) => {
                return (
                  <>
                    <a href={`/admin/users/${user}`}>{user}</a>
                    <br />
                  </>
                );
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Bol Trackings" span={3}>
              {this.props.product.active_offers.map((item) => {
                return (
                  <>
                    <a href={`/admin/offers/${item}`}>{item}</a>
                    <br />
                  </>
                );
              })}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <div style={{ marginTop: 12 }}>
            <Button
              onClick={this.handleProductReload}
              loading={this.props.reloadLoading}
            >
              Reload Product
            </Button>
          </div>
        </Box>
      </>
    );
  }
}
