import React from 'react';
import {
  Table,
  Tag,
  Typography,
  Modal,
  Switch,
  InputNumber,
  Divider,
  Button,
  Descriptions,
  Select
} from 'antd';
import { getAutoOfferInfo, getBolOfferInfo } from '../../../utils/bol';
import { ModalSwitchItem } from '../../../styles/style';
const { Option } = Select;
const { Text, Title } = Typography;
const WAIT_INTERVAL = 1000;
export default class BolItemView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'Live tracking',
        dataIndex: 'liveTracking',
        key: 'liveTracking',
        render: value => {
          if (value) return <Tag color="blue">Tracking</Tag>;
        }
      },
      {
        title: 'Current Price',
        dataIndex: 'currentPrice',
        key: 'currentPrice'
      },
      {
        title: 'Current Stock',
        dataIndex: 'currentStock',
        key: 'currentStock'
      },
      {
        title: 'Total sellers',
        dataIndex: 'totalSellers',
        key: 'totalSellers'
      },
      {
        title: 'Offer Rank',
        dataIndex: 'offerRank',
        key: 'offerRank'
      },
      {
        title: 'Buy Box',
        dataIndex: 'buyBox',
        key: 'buyBox',
        render: value =>
          value ? <Tag color="green">Currently Buy Box</Tag> : null
      },
      {
        title: 'Configure',
        key: 'configure',
        render: value => (
          <span>
            <a onClick={() => this.handleModal(value)}>Configure</a>
          </span>
        )
      }
    ];
    this.handleModal = this.handleModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeAutoPrice = this.handleChangeAutoPrice.bind(this);
  }
  handleModal = async e => {
    this.props.handleCommission(
      this.props.bolOffer.bolOffer.ean,
      this.props.bolOffer.pricing.bundlePrices[0].price,
      false
    );
    this.props.handleCommission(
      this.props.bolOffer.bolOffer.ean,
      this.props.bolOffer.bolOffer.min_listing_price,
      true
    );
    this.setState({ showModal: true });
  };
  handleAvailable = checked => {
    console.log(checked);
    // this.props.handleAvailability(checked,)
  };
  handleOk = () => {
    this.setState({ showModal: false });
    this.props.handleSubmit(this.props.bolOffer.bolOffer._id);
  };
  handleCancel = () => {
    this.setState({ showModal: false });
  };
  handleChangeAutoPrice = checked => {
    this.props.onChange('autoPriceChanger', checked);
  };
  handleChangeMinProfit = e => {
    this.props.onChange('minProfit', e);
  };
  handleChangePriceChangeAmount = e => {
    this.props.onChange('priceChangeAmount', e);
  };
  handleChangeMinListingPrice = e => {
    this.props.onChange('minListingPrice', e);
    clearTimeout(this.minListingtimer);
    this.minListingtimer = setTimeout(() => {
      this.props.handleCommission(
        this.props.bolOffer.ean,
        this.props.minListingPrice,
        true
      );
    }, WAIT_INTERVAL);
  };
  handleChosenBolOffer = value => {
    this.props.onChange('bolId', value);
  };
  handleAdditionalCosts = e => {
    this.props.onChange('additionalCosts', e);
  };
  handleUpdateStockChange = e => {
    this.props.onChange('stockUpdate', e);
  };
  handleUpdatePriceChange = e => {
    this.props.onChange('priceUpdate', e);
    this.props.onChange('autoPriceChanger', false);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.handleCommission(
        this.props.bolOffer.ean,
        this.props.priceUpdate,
        false
      );
    }, WAIT_INTERVAL);
  };
  render() {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <Title level={4} style={{ fontSize: 18 }}>
            Bol.com
          </Title>
          {this.props.inventoryItem.bol_id && (
            <Button onClick={this.props.handleEditBol}>Edit</Button>
          )}
        </div>
        {!this.props.inventoryItem.bol_id && (
          <Select
            showSearch
            onFocus={this.props.handleBolOffers}
            style={{ width: '100%' }}
            onChange={this.handleChosenBolOffer}
            placeholder="Select a person"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.props.bolOffers &&
              this.props.bolOffers.map(bolOffer => {
                return (
                  <Option
                    disabled={bolOffer.linked_to_inventory_item ? true : false}
                    value={bolOffer._id}
                  >
                    <div>
                      <Text strong style={{ marginRight: 5 }}>
                        {bolOffer.ean}
                      </Text>
                      <Text>{bolOffer.product_name}</Text>
                    </div>
                  </Option>
                );
              })}
          </Select>
        )}
        {!this.props.inventoryItem.bol_id && (
          <Button
            onClick={this.props.saveSelectedBolOffer}
            style={{ marginTop: 10 }}
          >
            Save Offer
          </Button>
        )}
        {this.props.inventoryItem.bol_id && this.props.bolOffer && (
          <>
            <Descriptions bordered>
              <Descriptions.Item label="Total Sold" span={3}>
                {this.props.bolOffer.bolOffer.total_sold}
              </Descriptions.Item>
              <Descriptions.Item label="Available" span={3}>
                <Switch
                  defaultChecked={
                    this.props.bolOffer.bolOffer.active ? true : false
                  }
                  onChange={this.handleAvailable}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Product EAN" span={3}>
                <Text>{this.props.bolOffer.bolOffer.ean}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Table
              pagination={false}
              dataSource={this.props.tableData}
              columns={this.columns}
              style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            />
          </>
        )}
        {this.props.bolOffer && (
          <Modal
            title="Offer configuration"
            visible={this.state.showModal}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <ModalSwitchItem>
              <Text>Auto Price updater</Text>
              <Switch
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
                  defaultValue={this.props.bolOffer.price_change_amount || 0.01}
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
                disabled
              />
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Update Price</Text>
              <InputNumber
                disabled={this.props.autoPriceChanger ? true : false}
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
        )}
      </>
    );
  }
}
