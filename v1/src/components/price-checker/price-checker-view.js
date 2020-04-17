import React from 'react';
import { Box } from '../../styles/style';
import {
  Button,
  Table,
  // Modal,
  Tag,
  // Switch,
  // Typography,
  // Divider,
  // InputNumber,
} from 'antd';
import { getAutoOfferInfo } from '../../utils/bol';
// const { Text } = Typography;

const WAIT_INTERVAL = 1000;

export default class PriceCheckerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedOffer: null,
    };
    this.columns = [
      {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: 'Live tracking',
        dataIndex: 'liveTracking',
        key: 'liveTracking',
        render: (value) => {
          if (value) return <Tag color="blue">Tracking</Tag>;
        },
      },
      {
        title: 'Current Price',
        dataIndex: 'currentPrice',
        key: 'currentPrice',
      },
      {
        title: 'Current Stock',
        dataIndex: 'currentStock',
        key: 'currentStock',
      },
      {
        title: 'Total sellers',
        dataIndex: 'totalSellers',
        key: 'totalSellers',
      },
      {
        title: 'Offer Rank',
        dataIndex: 'offerRank',
        key: 'offerRank',
      },
      {
        title: 'Best Offer',
        dataIndex: 'bestOffer',
        key: 'bestOffer',
        render: (value) => {
          return <Tag color="green">Currently top offer</Tag>;
        },
      },
      {
        title: 'Configure',
        key: 'configure',
        render: (value) => (
          <span>
            <span onClick={() => this.handleModal(value)}>Configure</span>
            <br />
            <span
              onClick={() =>
                this.props.history.push(
                  `/product-management/${value.offerInfo.autoOffer._id}`
                )
              }
            >
              View
            </span>
          </span>
        ),
      },
    ];
    this.timer = null;
    this.minListingTimer = null;

    this.handleModal = this.handleModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeAutoPrice = this.handleChangeAutoPrice.bind(this);
  }
  handleModal = async (e) => {
    const autoOfferInfo = await getAutoOfferInfo(e.offerInfo.autoOffer._id);
    this.props.onChange('currentOfferId', autoOfferInfo.offer_id);
    this.props.onChange('minProfit', autoOfferInfo.min_profit);
    this.props.onChange('minListingPrice', autoOfferInfo.min_listing_price);
    this.props.onChange('additionalCosts', autoOfferInfo.additional_costs);
    this.props.onChange('priceChangeAmount', autoOfferInfo.price_change_amount);
    this.props.onChange('priceUpdate', e.currentPrice);
    this.props.onChange('autoPriceChanger', autoOfferInfo.auto_track);
    this.props.onChange('stockUpdate', e.currentStock);
    this.props.handleCommission(e.ean, e.currentPrice, false);
    this.props.handleCommission(e.ean, this.props.minListingPrice, true);
    this.setState({ showModal: true, selectedOffer: e, autoOfferInfo });
  };
  handleOk = () => {
    this.setState({ showModal: false });
    this.props.handleSubmit(this.state.selectedOffer.offerInfo.autoOffer._id);
  };
  handleCancel = () => {
    this.setState({ showModal: false });
  };
  handleChangeAutoPrice = (checked) => {
    this.props.onChange('autoPriceChanger', checked);
  };
  handleChangeMinProfit = (e) => {
    this.props.onChange('minProfit', e);
  };
  handleChangePriceChangeAmount = (e) => {
    this.props.onChange('priceChangeAmount', e);
  };
  handleChangeMinListingPrice = (e) => {
    this.props.onChange('minListingPrice', e);
    clearTimeout(this.minListingtimer);
    this.minListingtimer = setTimeout(() => {
      this.props.handleCommission(
        this.state.selectedOffer.ean,
        this.props.minListingPrice,
        true
      );
    }, WAIT_INTERVAL);
  };
  handleAdditionalCosts = (e) => {
    this.props.onChange('additionalCosts', e);
  };
  handleUpdateStockChange = (e) => {
    this.props.onChange('stockUpdate', e);
  };
  handleUpdatePriceChange = (e) => {
    this.props.onChange('priceUpdate', e);
    this.props.onChange('autoPriceChanger', false);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.handleCommission(
        this.state.selectedOffer.ean,
        this.props.priceUpdate,
        false
      );
    }, WAIT_INTERVAL);
  };

  render() {
    return (
      <>
        <Box>
          <Button
            type="secondary"
            onClick={this.props.handleReloadOffers}
            loading={this.props.loadingOffers}
          >
            Reload your offers
          </Button>
        </Box>
        <Box>
          <Table dataSource={this.props.tableOffers} columns={this.columns} />
        </Box>

        {/* {this.state.selectedOffer && (
          <Modal
            title="Offer configuration"
            visible={this.state.showModal}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <ModalSwitchItem>
              <Text>Auto Price updater</Text>
              <Switch
                defaultChecked={this.state.autoOfferInfo.auto_track}
                onChange={this.handleChangeAutoPrice}
                checked={this.props.autoPriceChanger}
              />
            </ModalSwitchItem>
            {this.props.autoPriceChanger && (
              <ModalSwitchItem style={{ marginTop: 15 }}>
                <Text>Minimum Price boundary</Text>
                <InputNumber
                  defaultValue={this.props.minListingPrice}
                  formatter={value =>
                    `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  onChange={this.handleChangeMinListingPrice}
                />
              </ModalSwitchItem>
            )}
            {this.props.autoPriceChanger && (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 5
                  }}
                >
                  <Text strong style={{ fontSize: '0.7rem' }}>
                    Your minimum profit €{' '}
                    {this.props.minListingCommission &&
                      Math.round(
                        ((this.props.minListingPrice -
                          this.props.minListingCommission -
                          this.props.additionalCosts) *
                          100) /
                          100
                      ).toFixed(2)}
                  </Text>
                </div>
              </>
            )}
            {this.props.autoPriceChanger && (
              <ModalSwitchItem style={{ marginTop: 15 }}>
                <Text>Auto price change amount</Text>
                <InputNumber
                  defaultValue={
                    this.state.autoOfferInfo.price_change_amount || 0.01
                  }
                  formatter={value =>
                    `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  onChange={this.handleChangePriceChangeAmount}
                />
              </ModalSwitchItem>
            )}
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Update stock</Text>
              <InputNumber
                defaultValue={this.props.stockUpdate}
                onChange={this.handleUpdateStockChange}
              />
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Update Price</Text>
              <InputNumber
                defaultValue={this.props.priceUpdate}
                formatter={value =>
                  `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                onChange={this.handleUpdatePriceChange}
              />
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Additional costs (Shipping / Packaging / Product)</Text>
              <InputNumber
                defaultValue={this.props.additionalCosts}
                formatter={value =>
                  `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                onChange={this.handleAdditionalCosts}
              />
            </ModalSwitchItem>
            <Divider />
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
                    Lower price to €{' '}
                    {this.props.commissionReduction.maximumPrice}
                  </Text>
                  <br />
                  <Text strong style={{ fontSize: '0.7rem' }}>
                    Bol.com commission: €{' '}
                    {this.props.commissionReduction.costReduction}
                  </Text>
                </div>
              )}
            </ModalSwitchItem>

            <Divider />
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Bol.com Price</Text>
              <Text>
                {this.props.autoPriceChanger
                  ? `€ ${this.props.minListingPrice} -`
                  : null}{' '}
                € {this.props.priceUpdate}
              </Text>
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Bol.com commission</Text>
              <Text>
                {this.props.autoPriceChanger
                  ? `€ ${this.props.minListingCommission} -`
                  : null}{' '}
                € {this.props.bolReceivePrice}
              </Text>
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Additional costs</Text>
              <Text>€ {this.props.additionalCosts}</Text>
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text strong>Total profit</Text>
              <Text strong>
                {this.props.autoPriceChanger
                  ? `€ ${this.props.minListingCommission &&
                      Math.round(
                        ((this.props.minListingPrice -
                          this.props.minListingCommission -
                          this.props.additionalCosts) *
                          100) /
                          100
                      ).toFixed(2)} - `
                  : null}
                €{' '}
                {Math.round(
                  ((this.props.priceUpdate -
                    this.props.bolReceivePrice -
                    this.props.additionalCosts) *
                    100) /
                    100
                ).toFixed(2)}
              </Text>
            </ModalSwitchItem>
          </Modal>
        )} */}
      </>
    );
  }
}
