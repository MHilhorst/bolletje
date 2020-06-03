import React from 'react';
import { Box, LabelInput, LabelDescription } from '../../styles/style';
import {
  Button,
  Table,
  Modal,
  Tag,
  Select,
  // Switch,
  // Typography,
  // Divider,
  // InputNumber,
  Input,
  Alert,
  InputNumber,
  Badge,
  Tooltip,
  Divider,
} from 'antd';

const getFormattedDate = (date) => {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return (
    dd +
    '-' +
    mm +
    '-' +
    yyyy +
    ' ' +
    hours +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes)
  );
};

const WAIT_INTERVAL = 1000;
const { Option, OptGroup } = Select;
export default class PriceCheckerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedOffer: null,
    };
    this.selectOffersColumns = [
      {
        title: 'EAN',
        dataIndex: 'ean',
      },
      {
        title: 'Offer ID',
        dataIndex: 'offerId',
      },
      {
        title: 'Imported',
        dataIndex: 'imported',
        render: (value, record) => {
          return this.props.tableOffers.findIndex((tableOffer) => {
            return tableOffer.ean === record.ean;
          }) !== -1 ? (
            <Tag color="orange">Already Imported</Tag>
          ) : (
            false
          );
        },
      },
    ];
    this.columns = [
      // {
      //   title: 'Datafeed Sync',
      //   dataIndex: 'sync',
      //   align: 'center',
      //   key: 'sync',
      //   render: (value) => {
      //     return value ? (
      //       <>
      //         <Badge status="success" style={{ width: 5, height: 5 }} />
      //       </>
      //     ) : null;
      //   },
      // },
      {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName',
        render: (value, record) => {
          return <a href={`/price-checker/${record.id}`}>{value}</a>;
        },
      },
      {
        title: 'Live tracking',
        dataIndex: 'liveTracking',
        key: 'liveTracking',
        render: (value, record) => {
          if (record.datafeed) {
            return <Tag color="green">Datafeed</Tag>;
          } else {
            if (value) return <Tag color="blue">Tracking</Tag>;
            else {
              return (
                <Tag color="orange">Not Tracking</Tag>
                // <Button
                //   onClick={() => {
                //     console.log('clicked');
                //     this.handleStartRepricer(record);
                //   }}
                // >
                //   Activate
                // </Button>
              );
            }
          }
        },
      },
      { title: 'Strategy', dataIndex: 'strategyName', key: 'strategyName' },
      { title: 'ean', dataIndex: 'ean', key: 'ean' },
      {
        title: 'Current Price',
        dataIndex: 'currentPrice',
        key: 'currentPrice',
        render: (value) => {
          return '€ ' + value;
        },
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
        title: 'Minimum Price',
        dataIndex: 'minPrice',
        key: 'minPrice',
        render: (value, record) => {
          if (record.datafeed) {
            return <Tag color="default">X</Tag>;
          }
          return value ? '€ ' + value : null;
        },
      },
      {
        title: 'Best Offer',
        dataIndex: 'bestOffer',
        key: 'bestOffer',
        render: (value) => {
          if (!value) return <Tag color="red">Not Top Offer</Tag>;
          return <Tag color="green">Currently top offer</Tag>;
        },
      },
      {
        title: 'Increment Amount',
        dataIndex: 'incrementAmount',
        key: 'incrementAmount',
        render: (value, record) => {
          if (record.datafeed) {
            return <Tag color="default">X</Tag>;
          }
          return value ? '€ ' + value : null;
        },
      },
      {
        title: 'Bol Active',
        dataIndex: 'bolActive',
        key: 'bolActive',
        render: (value) => {
          if (value) return <Tag color="green">Active</Tag>;
          return <Tag color="orange">On Hold</Tag>;
        },
      },
      {
        title: 'Purchase Price',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        render: (value, record) => {
          if (value) {
            return value;
          } else {
            return (
              <Button onClick={() => this.openModalPurchase(record)}>
                Add
              </Button>
            );
          }
        },
      },
    ];
    this.timer = null;
    this.minListingTimer = null;

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeAutoPrice = this.handleChangeAutoPrice.bind(this);
  }
  openModalPurchase = (repricerProduct) => {
    this.props.onChange('showProductCostData', true);
    this.props.onChange('purchaseCosts', repricerProduct.purchaseCosts);
    this.props.onChange('repricerOfferId', repricerProduct.id);
    this.props.onChange(
      'repricerOfferTitle',
      repricerProduct.productName.substring(
        0,
        repricerProduct.productName.length > 90
          ? 90
          : repricerProduct.productName.length
      ) + (repricerProduct.productName.length > 90 ? '...' : '')
    );
    this.props.onChange('shippingCosts', repricerProduct.shippingCosts);
  };
  handleStartRepricer = async (e) => {
    this.props.onChange('repricerActive', 2);
    this.props.onChange('activeRepricerOffer');
    this.props.handleUpdateRepricerOffer(e.id);
  };

  handleOk = () => {
    this.props.handleUploadUrl();
  };
  handleCancel = () => {
    this.setState({ showCsvModal: false });
    this.props.onChange('showProductCostData', false);
    this.props.onChange('selectOffersModal', false);
  };
  handleChangeAutoPrice = (checked) => {
    this.props.onChange('autoPriceChanger', checked);
  };
  handleChangeMinProfit = (e) => {
    this.props.onChange('minProfit', e);
  };
  handleCsvUrlChange = (e) => {
    this.props.onChange('url', e.target.value);
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
  getDefaultExportId = (updates) => {
    const pendingOffer = updates.reverse().findIndex((update) => {
      return update.status === 'PENDING';
    });
    if (pendingOffer !== -1) return updates[pendingOffer].id;
    return 'NEW';
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

  handlePurchasePriceChange = (e) => {
    this.props.onChange('purchaseCosts', e);
  };
  handleShippingCost = (e) => {
    this.props.onChange('shippingCosts', e);
  };
  handleSelectedReloadOfferId = (e) => {
    this.props.onChange('requestId', e);
  };
  render() {
    return (
      <>
        <Box>
          <Select
            defaultValue={this.getDefaultExportId(
              this.props.user.status.updates
            )}
            style={{ width: 360 }}
            onChange={this.handleSelectedReloadOfferId}
          >
            <OptGroup label={'NEW'}>
              <Option
                value={'NEW'}
                style={{ backgroundColor: '#fafafa', fontWeight: '500' }}
                disabled={
                  this.props.user.status.updates.findIndex((update) => {
                    return update.status === 'PENDING';
                  }) === -1
                    ? false
                    : true
                }
              >
                Create new Export File
              </Option>
            </OptGroup>
            <OptGroup label={'PENDING'}>
              {this.props.user.status.updates
                .sort((a, b) => {
                  return b.timestamp - a.timestamp;
                })
                .map((update) => {
                  if (update.status === 'PENDING')
                    return (
                      <Option value={update.id}>
                        Offer Export File{' '}
                        {getFormattedDate(new Date(update.timestamp))}{' '}
                        <Tooltip title={update.id}>
                          <Tag color="orange">PENDING</Tag>
                        </Tooltip>
                      </Option>
                    );
                  else return false;
                })}
            </OptGroup>
            <OptGroup label={'SUCCESS'}>
              {this.props.user.status.updates
                .sort((a, b) => {
                  return b.timestamp - a.timestamp;
                })
                .map((update) => {
                  if (update.status === 'SUCCESS') {
                    return (
                      <Option
                        value={update.id}
                        style={{ paddingBottom: 7 }}
                        disabled={
                          this.props.user.status.updates.findIndex((update) => {
                            return update.status === 'PENDING';
                          }) === -1
                            ? false
                            : true
                        }
                      >
                        Offer Export File{' '}
                        {getFormattedDate(new Date(update.timestamp))}{' '}
                        <Tooltip title={update.id}>
                          <Tag color="green">SUCCESS</Tag>
                        </Tooltip>
                        <Badge
                          count={update.total_items}
                          className="site-badge-count-4"
                        />
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
            </OptGroup>
            <OptGroup label={'FAILED'}>
              {this.props.user.status.updates
                .sort((a, b) => {
                  return b.timestamp - a.timestamp;
                })
                .map((update) => {
                  if (update.status === 'FAILURE') {
                    return (
                      <Option
                        value={update.id}
                        disabled={
                          this.props.user.status.updates.findIndex((update) => {
                            return update.status === 'PENDING';
                          }) === -1
                            ? false
                            : true
                        }
                      >
                        Offer Export File{' '}
                        {getFormattedDate(new Date(update.timestamp))}{' '}
                        <Tooltip title={update.id}>
                          <Tag color="red">FAILURE</Tag>
                        </Tooltip>
                      </Option>
                    );
                  } else {
                    return false;
                  }
                })}
            </OptGroup>
          </Select>
          <Button
            type="secondary"
            onClick={this.props.handleReloadOffers}
            loading={this.props.loadingOffers}
            style={{ marginLeft: 6 }}
          >
            Reload your offers
          </Button>{' '}
          {this.props.user.hasOwnProperty('status') &&
            this.props.user.status.export_file && (
              <Tag color="green" style={{ marginLeft: 6 }}>
                Last Load Succes at{' '}
                {this.props.user.status.export_file_time_created}
              </Tag>
            )}
          {this.props.user.hasOwnProperty('status') &&
            !this.props.user.status.export_file && (
              <Tag color="red" style={{ marginLeft: 6 }}>
                Previous Load failed at{' '}
                {this.props.user.status.export_file_time_created}
              </Tag>
            )}
        </Box>
        <Box>
          {this.props.selectedExistingOffers.length > 0 && (
            <>
              <Select
                onChange={this.props.handleSelectedStrategy}
                value={this.props.selectedStrategy}
                style={{ width: 360, marginBottom: 12 }}
              >
                {this.props.strategies.map((strategy) => {
                  return (
                    <Option value={strategy._id}>
                      {strategy.strategy_name}{' '}
                      {strategy.strategy_type === 'targetBuyBox' ? (
                        <Tag color="blue">Buy Box</Tag>
                      ) : strategy.strategy_type === 'datafeed' ? (
                        <Tag color="green">Datafeed</Tag>
                      ) : null}
                    </Option>
                  );
                })}
              </Select>
              <Button
                onClick={this.props.updateOffersWithStrategy}
                style={{ marginLeft: 6 }}
              >
                Update Offers with Strategy
              </Button>
            </>
          )}
          <Table
            dataSource={this.props.tableOffers}
            columns={this.columns}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                const selectedExistingOffers = selectedRows.map((row) => {
                  return row.id;
                });
                this.props.onChange(
                  'selectedExistingOffers',
                  selectedExistingOffers
                );
              },
            }}
          />
        </Box>

        {/* <Modal
          title="CSV Upload URL"
          visible={this.state.showCsvModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={'Import'}
          confirmLoading={this.props.loadingCSVImport}
        >
          <LabelInput>CSV URL</LabelInput>
          <br />
          <LabelDescription>
            Make sure the URL is public available. Paste the whole URL
          </LabelDescription>
          <Input
            style={{ marginTop: 4 }}
            addonBefore="https://"
            placeholder="https://docs.google.com/spreadsheets/d/"
            onChange={this.handleCsvUrlChange}
            defaultValue={this.props.user.csv.url}
          />
          {this.props.noUrlError && (
            <Alert
              message="No URL"
              type="error"
              style={{ marginTop: 12, marginBottom: 12 }}
              showIcon
            />
          )}
          {this.props.outputCsvError && (
            <Alert
              message="Make sure you are publishing a CSV file from Google Spreadsheet and not a Webpage."
              type="error"
              style={{ marginTop: 12, marginBottom: 12 }}
              showIcon
            />
          )}
        </Modal> */}
        <Modal
          title={`Select Offers ${
            this.props.selectedOffers.length + this.props.tableOffers.length
          }/${this.props.user.subscription.repricer_max_track_items}`}
          visible={this.props.selectOffersModal}
          onOk={this.props.handleSetSelectedOffers}
          onCancel={this.handleCancel}
          okText={'Import'}
          confirmLoading={this.props.loadingImport}
          width={714}
        >
          {/* <Input
            placeholder="Search Name"
            value={this.props.eanSearch}
            onChange={(e) => {
              this.props.onChange('eanSearch', e.target.value);
              const filteredData = this.props.selectOffersData.filter((entry) =>
                entry.ean.includes(e.target.value)
              );
              this.props.onChange('selectOffersData', filteredData);
            }}
          /> */}
          <Table
            columns={this.selectOffersColumns}
            dataSource={this.props.selectOffersData}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                const selectedOffers = selectedRows.map((row) => {
                  return row.offerId;
                });
                this.props.onChange('selectedOffers', selectedOffers);
              },
              getCheckboxProps: (record) => ({
                disabled:
                  this.props.tableOffers.findIndex((tableOffer) => {
                    return tableOffer.ean === record.ean;
                  }) !== -1
                    ? true
                    : false,
                ean: record.ean,
              }),
            }}
          />
        </Modal>
        <Modal
          title={`Add product cost data | ${this.props.repricerOfferTitle}`}
          onOk={this.props.handleAddProductCostData}
          okText={'Submit'}
          onCancel={this.handleCancel}
          width={460}
          confirmLoading={this.props.loadingUpdateProductDataCost}
          visible={this.props.showProductCostData}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{ fontWeight: 500 }}>Purchase Costs</label>
            <InputNumber
              style={{ marginTop: 6 }}
              onChange={this.handlePurchasePriceChange}
              defaultValue={this.props.purchaseCosts}
              formatter={(value) =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </div>
          <Divider />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{ fontWeight: 500 }}>Shipping Costs</label>
            <InputNumber
              style={{ marginTop: 6 }}
              onChange={this.handleShippingCost}
              defaultValue={this.props.shippingCosts}
              formatter={(value) =>
                `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </div>
        </Modal>
      </>
    );
  }
}
