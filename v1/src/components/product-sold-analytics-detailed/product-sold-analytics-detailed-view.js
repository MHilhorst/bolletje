import React from "react";
import { Box, ModalSwitchItem } from "../../styles/style";
import Offer from "./offer/offer-view";
import {
  Descriptions,
  Badge,
  Button,
  Modal,
  Typography,
  Switch,
  InputNumber,
  Divider,
  Tag,
  Col,
  Input,
  Row,
  Statistic,
  Drawer,
  Comment,
  Avatar,
  Tooltip
} from "antd";
const { Text } = Typography;
const { Search } = Input;
const getFormattedDate = date => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date
    .getDate()
    .toString()
    .padStart(2, "0");

  return month + "/" + day + "/" + year;
};

const getLowestPrice = offer_ids => {
  let minValue = offer_ids[0].price;
  for (var i = 0; i < offer_ids.length; i++) {
    if (offer_ids[i].price < minValue) {
      minValue = offer_ids[i].price;
    }
  }
  return minValue;
};
const WAIT_INTERVAL = 1000;
export default class ProductSoldAnalyticsDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      drawerSuggestions: false
    };
    this.timer = null;
  }
  handleChangeBolPrice = value => {
    this.props.onChange("bolPrice", value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.handleCommission(this.props.product.ean, value);
    }, WAIT_INTERVAL);
  };
  handleChangePackagingCosts = value => {
    this.props.onChange("packagingCosts", value);
  };
  handleChangeProductCosts = value => {
    this.props.onChange("productCosts", value);
  };
  showPriceSuggestions = () => {
    this.setState({ drawerSuggestions: true });
  };
  handleClosePriceSuggestion = () => {
    this.setState({ drawerSuggestions: false });
  };
  handleOk = () => {
    this.setState({ visible: false });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  async componentDidMount() {
    this.handleChangeBolPrice(this.props.offers[0].price);
  }
  render() {
    console.log(this.props.product);
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
            <Descriptions.Item label="Tracking Status" span={1}>
              <Badge status="processing" text="Tracking" />
            </Descriptions.Item>
            <Descriptions.Item label="Price suggestion" span={2}>
              <a onClick={this.showPriceSuggestions}>48.43</a>
            </Descriptions.Item>
            <Descriptions.Item label="Calculate Profit" span={3}>
              <Button onClick={() => this.setState({ visible: true })}>
                Calculate Profit
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </Box>
        <Row gutter={[16, 16]}>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic
                title="Total Sold Since Tracking"
                value={this.props.product.total_sold}
              />
            </Box>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic
                title="Estimated Monthly Sales"
                value={
                  Math.round(
                    this.props.product.total_sold /
                      Math.round(
                        (new Date().getTime() -
                          new Date(
                            this.props.product.tracking_since
                          ).getTime()) /
                          1000 /
                          86400
                      )
                  ) * 30
                }
              />
            </Box>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic
                title="Avg Daily sales"
                value={Math.round(
                  this.props.product.total_sold /
                    Math.round(
                      (new Date().getTime() -
                        new Date(this.props.product.tracking_since).getTime()) /
                        1000 /
                        86400
                    )
                )}
              />
            </Box>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic
                title="Estimated Monthly Revenue"
                value={
                  "€ " +
                  Math.round(
                    this.props.product.total_sold /
                      Math.round(
                        (new Date().getTime() -
                          new Date(
                            this.props.product.tracking_since
                          ).getTime()) /
                          1000 /
                          86400
                      )
                  ) *
                    30 *
                    (this.props.product.offer_ids.length > 0
                      ? getLowestPrice(this.props.product.offer_ids)
                      : 0)
                }
              />
            </Box>
          </Col>
        </Row>
        {this.props.offers.map(offer => {
          return (
            <Box>
              <Offer offer={offer} />
            </Box>
          );
        })}
        <Modal
          title="Profit Calculator"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ModalSwitchItem>
            <Text>Bol.com Listing Price</Text>
            <InputNumber
              defaultValue={this.props.bolPrice}
              formatter={value =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={this.handleChangeBolPrice}
            />
          </ModalSwitchItem>
          <ModalSwitchItem style={{ marginTop: 15 }}>
            <Text>Packaging Costs</Text>
            <InputNumber
              defaultValue={this.props.packagingCosts}
              formatter={value =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={this.handleChangePackagingCosts}
            />
          </ModalSwitchItem>
          <ModalSwitchItem style={{ marginTop: 15 }}>
            <Text>Product Costs</Text>
            <InputNumber
              defaultValue={this.props.packagingCosts}
              formatter={value =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={this.handleChangeProductCosts}
            />
          </ModalSwitchItem>
          <Divider />
          <ModalSwitchItem style={{ marginTop: 15 }}>
            {this.props.commissionReduction && (
              <Tag color="green">
                Reduction available until{" "}
                {this.props.commissionReduction.endDate}
              </Tag>
            )}
            {this.props.commissionReduction && (
              <div style={{ textAlign: "right" }}>
                <Text>
                  Lower price to € {this.props.commissionReduction.maximumPrice}
                </Text>
                <br />
                <Text strong style={{ fontSize: "0.7rem" }}>
                  Bol.com commission: €{" "}
                  {this.props.commissionReduction.costReduction}
                </Text>
              </div>
            )}
            {!this.props.commissionReduction && (
              <Tag color="red">No reduction available</Tag>
            )}
          </ModalSwitchItem>
          <Divider />
          <ModalSwitchItem>
            <Text>Bol.com commission</Text>
            {this.props.commissionReduction && (
              <Text>
                {(this.props.bolPrice <
                this.props.commissionReduction.maximumPrice
                  ? this.props.commissionReduction.costReduction
                  : (this.props.bolPrice / 100) *
                    this.props.bolCommissionPercentage
                ).toFixed(2)}
              </Text>
            )}
            {!this.props.commissionReduction && (
              <Text>
                {(
                  (this.props.bolPrice / 100) *
                  this.props.bolCommissionPercentage
                ).toFixed(2)}
              </Text>
            )}
          </ModalSwitchItem>
          <ModalSwitchItem>
            <Text strong>Profit</Text>
            <Text strong>
              {(
                this.props.bolPrice -
                (this.props.bolPrice / 100) *
                  this.props.bolCommissionPercentage -
                this.props.packagingCosts -
                this.props.productCosts
              ).toFixed(2)}
            </Text>
          </ModalSwitchItem>
          <ModalSwitchItem>
            <Text strong>Profit Margin</Text>
            <Text strong>
              {(
                ((this.props.bolPrice -
                  (this.props.bolPrice / 100) *
                    this.props.bolCommissionPercentage -
                  this.props.packagingCosts -
                  this.props.productCosts) /
                  this.props.bolPrice) *
                100
              ).toFixed(2)}{" "}
              %
            </Text>
          </ModalSwitchItem>
        </Modal>
        <Drawer
          title="Community Price Suggestions"
          placement="right"
          closable={false}
          onClose={this.handleClosePriceSuggestion}
          width={640}
          visible={this.state.drawerSuggestions}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div>
              <Comment
                author={<a>Han Solo</a>}
                avatar={
                  <Avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    alt="Han Solo"
                  />
                }
                content={
                  <p>
                    We supply a series of design principles, practical patterns
                    and high quality design resources (Sketch and Axure), to
                    help people create their product prototypes beautifully and
                    efficiently.
                  </p>
                }
                datetime={
                  <Tooltip title={Date.now()}>
                    <span>{Date.now()}</span>
                  </Tooltip>
                }
              />
              <Comment
                author={<a>Han Solo</a>}
                avatar={
                  <Avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    alt="Han Solo"
                  />
                }
                content={
                  <p>
                    We supply a series of design principles, practical patterns
                    and
                  </p>
                }
                datetime={
                  <Tooltip title={Date.now()}>
                    <span>{Date.now()}</span>
                  </Tooltip>
                }
              />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "100%",
              padding: 20
            }}
          >
            <Search
              placeholder="input search text"
              enterButton="Send"
              size="large"
              onSearch={value => console.log(value)}
            />
          </div>
        </Drawer>
      </>
    );
  }
}
