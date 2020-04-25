import React from 'react';
import { Box, ModalSwitchItem } from '../../styles/style';
import Offer from './offer/offer-view';
import {
  Descriptions,
  Badge,
  Button,
  Modal,
  Typography,
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
  Tooltip,
  Select,
} from 'antd';
const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const getFormattedDate = (date) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
};

const getLowestPrice = (offer_ids) => {
  let minValue = offer_ids[0].price;
  for (var i = 0; i < offer_ids.length; i++) {
    if (offer_ids[i].price < minValue) {
      minValue = offer_ids[i].price;
    }
  }
  return minValue;
};

const setActiveOffersFirst = (offers, active_offers) => {
  // active_offers.forEach((active_offer) => {
  //   console.log(active_offer, offers);
  //   console.log(offers.indexOf(active_offer));
  // });
  active_offers.forEach((active_offer) => {
    const offer = offers.findIndex(
      (x) => x.public_offer_id.toString() === active_offer
    );
    console.log(offer, offers[offer]);
    offers.unshift(offers.splice(offer, 1)[0]);
  });
  console.log(offers);
  return offers;
};

// Change the way lastDay amount is fetched > Use For loop to get first item in reversed array that is equal to a day earlier. Other option is to check how often a product is updated in a day and setting it to 1. It will only check for a whole day once.
const getLast24hourSales = (offers) => {
  let totalSold = 0;
  offers.forEach((offer) => {
    let sold = 0;
    const lastDay = offer.updates.slice(Math.max(offer.updates.length - 30, 1));
    lastDay.forEach((offer) => {
      sold += offer.quantitySoldSincePrevious;
    });
    totalSold += sold;
  });
  return totalSold;
};

// const getLast24hourSales = (offers) => {
//   let totalSold = 0;
//   offers.forEach((offer) => {
//     offer.updates.map((update) => {
//       let
//     });
//   });
// };

const WAIT_INTERVAL = 1000;

export default class ProductSoldAnalyticsDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      drawerSuggestions: false,
      graphType: 'stepline',
      offers: [],
      loading: true,
    };
    this.timer = null;
  }
  handleChangeBolPrice = (value) => {
    this.props.onChange('bolPrice', value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.handleCommission(this.props.product.ean, value);
    }, WAIT_INTERVAL);
  };
  handleChangePackagingCosts = (value) => {
    this.props.onChange('packagingCosts', value);
  };
  handleChangeProductCosts = (value) => {
    this.props.onChange('productCosts', value);
  };
  showPriceSuggestions = () => {
    this.setState({ drawerSuggestions: true });
  };
  handleClosePriceSuggestion = () => {
    this.setState({ drawerSuggestions: false });
  };
  handleChangeGraphType = (v) => {
    this.setState({ graphType: v });
  };
  handleOk = () => {
    this.setState({ visible: false });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleDeleteProduct = () => {
    this.props.deleteProduct();
  };

  async componentDidMount() {
    if (this.props.offers.length > 0) {
      const offers = await setActiveOffersFirst(
        this.props.offers,
        this.props.product.active_offers
      );
      this.setState({ offers, loading: false });
    } else {
      this.setState({ loading: false });
    }
    // this.handleChangeBolPrice(this.props.offers[0].price);
  }

  render() {
    return (
      <>
        {this.props.user.admin_account && (
          <Box>
            <Button onClick={this.handleDeleteProduct}>Delete product</Button>
          </Box>
        )}
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
              ) + ' Hours'}
            </Descriptions.Item>
            <Descriptions.Item label="Tracking Status" span={1}>
              <Badge status="processing" />
              <Tag color="green">Live Tracking</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Price suggestion" span={2}>
              <span onClick={this.showPriceSuggestions}>48.43</span>
            </Descriptions.Item>
            <Descriptions.Item label="Calculate Profit" span={1}>
              <Button onClick={() => this.setState({ visible: true })}>
                Calculate Profit
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="Chart Type" span={2}>
              <Select
                defaultValue="stepline"
                onChange={this.handleChangeGraphType}
              >
                <Option value="smooth">Smooth</Option>
                <Option value="straight">Straight</Option>
                <Option value="stepline">Stepline</Option>
              </Select>
            </Descriptions.Item>
          </Descriptions>
        </Box>
        {this.props.user.admin_account && (
          <Box>
            <Descriptions title="Developer Information" bordered>
              <Descriptions.Item label="Internal ID">
                {this.props.product._id}
              </Descriptions.Item>
              <Descriptions.Item label="Last Offer Check">
                {this.props.product.last_offer_check}
              </Descriptions.Item>
              <Descriptions.Item label="Last Old Offer Wipe">
                {this.props.product.last_old_offer_wipe}
              </Descriptions.Item>
              <Descriptions.Item label="Active Offers">
                {this.props.product.active_offers.map((offer) => {
                  return (
                    <>
                      <span>{offer}</span>
                      <br />
                    </>
                  );
                })}
              </Descriptions.Item>
            </Descriptions>
          </Box>
        )}
        <Row gutter={[16, 16]}>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic
                title="Total Sold Since Tracking"
                formatter={(value) => {
                  return (
                    <div>
                      <span>{this.props.product.total_sold} </span>
                      <Badge
                        className="site-badge-count-109"
                        count={
                          '+ ' +
                          `${getLast24hourSales(this.state.offers)}` +
                          ' In last 24 hours'
                        }
                        style={{ backgroundColor: '#52c41a', marginBottom: 5 }}
                      />
                    </div>
                  );
                }}
                // value={this.props.product.total_sold}
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
                      ((new Date().getTime() -
                        new Date(this.props.product.tracking_since).getTime()) /
                        1000 /
                        86400)
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
                    ((new Date().getTime() -
                      new Date(this.props.product.tracking_since).getTime()) /
                      1000 /
                      86400)
                )}
              />
            </Box>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              {!this.state.loading && (
                <Statistic
                  title="Estimated Monthly Revenue"
                  value={
                    '€ ' +
                    Math.round(
                      (this.props.product.total_sold /
                        ((new Date().getTime() -
                          new Date(
                            this.props.product.tracking_since
                          ).getTime()) /
                          1000 /
                          86400)) *
                        30 *
                        (this.props.product.offer_ids.length > 0
                          ? getLowestPrice(this.props.product.offer_ids)
                          : this.state.offers[0].price
                        ).toFixed(2)
                    )
                  }
                />
              )}
            </Box>
          </Col>
        </Row>
        {!this.state.loading &&
          this.state.offers.map((offer) => {
            return (
              <Box>
                <Offer
                  offer={offer}
                  graphType={this.state.graphType}
                  product={this.props.product}
                />
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
              formatter={(value) =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              onChange={this.handleChangeBolPrice}
            />
          </ModalSwitchItem>
          <ModalSwitchItem style={{ marginTop: 15 }}>
            <Text>Packaging Costs</Text>
            <InputNumber
              defaultValue={this.props.packagingCosts}
              formatter={(value) =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              onChange={this.handleChangePackagingCosts}
            />
          </ModalSwitchItem>
          <ModalSwitchItem style={{ marginTop: 15 }}>
            <Text>Product Costs</Text>
            <InputNumber
              defaultValue={this.props.packagingCosts}
              formatter={(value) =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              onChange={this.handleChangeProductCosts}
            />
          </ModalSwitchItem>
          <ModalSwitchItem style={{ marginTop: 15 }}>
            {this.props.commissionReduction && (
              <Tag color="green">
                Reduction available until{' '}
                {this.props.commissionReduction.endDate}
              </Tag>
            )}
            {this.props.commissionReduction && (
              <div style={{ textAlign: 'right' }}>
                <Text>
                  Lower price to € {this.props.commissionReduction.maximumPrice}
                </Text>
                <br />
                <Text strong style={{ fontSize: '0.7rem' }}>
                  Bol.com commission: €{' '}
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
              ).toFixed(2)}{' '}
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
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div>
              <Comment
                author={<span>Han Solo</span>}
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
                author={<span>asd</span>}
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
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              padding: 20,
            }}
          >
            <Search
              placeholder="input search text"
              enterButton="Send"
              size="large"
            />
          </div>
        </Drawer>
      </>
    );
  }
}
