import React from "react";
import { Box } from "../../styles/style";
import Offer from "./offer/offer-view";
import { Descriptions, Badge } from "antd";

const getFormattedDate = date => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date
    .getDate()
    .toString()
    .padStart(2, "0");

  return month + "/" + day + "/" + year;
};

export default class ProductSoldAnalyticsDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}
  render() {
    return (
      <>
        <Box>
          <Descriptions title="Product Information" bordered>
            <Descriptions.Item label="Product">
              <a href={this.props.product.url}>{this.props.product.title}</a>
            </Descriptions.Item>
            <Descriptions.Item label="Product ID">
              {this.props.product.product_id}
            </Descriptions.Item>
            <Descriptions.Item label="EAN">
              {this.props.product.ean}
            </Descriptions.Item>

            <Descriptions.Item label="Total Sold">
              {this.props.product.total_sold}
            </Descriptions.Item>
            <Descriptions.Item label="Total Sellers">
              {this.props.product.offer_ids.length}
            </Descriptions.Item>
            <Descriptions.Item label="Product Rating">
              {this.props.product.rating}
            </Descriptions.Item>
            <Descriptions.Item label="Tracking since">
              {getFormattedDate(new Date(this.props.product.tracking_since))}
            </Descriptions.Item>
            <Descriptions.Item label="Tracking Time" span={2}>
              {Math.round(
                (new Date().getTime() -
                  new Date(this.props.product.tracking_since).getTime()) /
                  1000 /
                  3600
              ) + " Hours"}
            </Descriptions.Item>
            <Descriptions.Item label="Tracking Status" span={3}>
              <Badge status="processing" text="Tracking" />
            </Descriptions.Item>
          </Descriptions>
        </Box>
        {this.props.offers.map(offer => {
          console.log(offer);
          return (
            <Box>
              <Offer offer={offer} />
            </Box>
          );
        })}
      </>
    );
  }
}
