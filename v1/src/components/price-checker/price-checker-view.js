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
  Badge,
  Tooltip,
} from 'antd';
// const { Text } = Typography;

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
      {
        title: 'Datafeed Sync',
        dataIndex: 'sync',
        align: 'center',
        key: 'sync',
        render: (value) => {
          return value ? (
            <>
              <Badge status="success" style={{ width: 5, height: 5 }} />
            </>
          ) : null;
        },
      },
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
        },
      },
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
        render: (value) => {
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
        render: (value) => {
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
    ];
    this.timer = null;
    this.minListingTimer = null;

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeAutoPrice = this.handleChangeAutoPrice.bind(this);
  }

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
                  this.props.user.status.updates
                    .reverse()
                    .findIndex((update) => {
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
                })
                .sort((a, b) => {
                  return b.timestamp - a.timestamp;
                })}
            </OptGroup>
            <OptGroup label={'SUCCESS'}>
              {this.props.user.status.updates
                .map((update) => {
                  if (update.status === 'SUCCESS')
                    return (
                      <Option
                        value={update.id}
                        style={{ paddingBottom: 7 }}
                        disabled={
                          this.props.user.status.updates
                            .reverse()
                            .findIndex((update) => {
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
                  else {
                    return null;
                  }
                })
                .sort((a, b) => {
                  return b.timestamp - a.timestamp;
                })}
            </OptGroup>
            <OptGroup label={'FAILED'}>
              {this.props.user.status.updates
                .map((update) => {
                  if (update.status === 'FAILURE') {
                    return (
                      <Option
                        value={update.id}
                        disabled={
                          this.props.user.status.updates
                            .reverse()
                            .findIndex((update) => {
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
                })
                .sort((a, b) => {
                  return b.timestamp - a.timestamp;
                })}
            </OptGroup>
          </Select>
          <Button
            type="secondary"
            onClick={this.props.handleReloadOffers}
            loading={this.props.loadingOffers}
          >
            Reload your offers
          </Button>{' '}
          {this.props.user.hasOwnProperty('status') &&
            this.props.user.status.export_file && (
              <Tag color="green">
                Last Load Succes at{' '}
                {this.props.user.status.export_file_time_created}
              </Tag>
            )}
          {this.props.user.hasOwnProperty('status') &&
            !this.props.user.status.export_file && (
              <Tag color="red" style={{ marginLeft: 12 }}>
                Previous Load failed at{' '}
                {this.props.user.status.export_file_time_created}
              </Tag>
            )}
        </Box>
        <Box>
          <Button
            type="secondary"
            // onClick={this.props.handleUploadUrl}
            onClick={() => this.setState({ showCsvModal: true })}
            loading={this.props.loadingCSVImport}
          >
            Upload CSV URL
          </Button>
        </Box>
        <Box>
          <Table dataSource={this.props.tableOffers} columns={this.columns} />
          <span>Producten zijn gelinkt aan de volgende url: </span>
          <a href={this.props.user.csv.url}>{'  '} link</a>
        </Box>

        <Modal
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
        </Modal>
        <Modal
          title={`Select Offers ${
            this.props.selectedOffers.length + this.props.tableOffers.length
          }/${this.props.user.subscription.repricer_max_track_items}`}
          visible={this.props.selectOffersModal}
          onOk={this.props.handleSetSelectedOffers}
          onCancel={this.handleCancel}
          okText={'Import'}
          confirmLoading={this.props.loadingCSVImport}
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
      </>
    );
  }
}
