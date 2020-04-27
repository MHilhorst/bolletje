import React from 'react';
import { Box } from '../../styles/style';
import { renderToString } from 'react-dom/server';
import {
  Table,
  Button,
  Switch,
  Card,
  Layout,
  Row,
  Col,
  Slider,
  Typography,
  Tag,
  Tooltip,
} from 'antd';
import Chart from 'react-apexcharts';
import Medal from '../../assets/images/medal-best-offer.svg';

const getSliderInfo = (offer, price) => {
  const sliderInfo = {
    0: (
      offer.updates[offer.updates.length - 1].buy_box.price -
      offer.updates[offer.updates.length - 1].buy_box.price * 0.1
    ).toFixed(2),
    100:
      offer.offers_visible[offer.offers_visible.length - 1].price +
      offer.offers_visible[offer.offers_visible.length - 1].price * 0.1,
  };

  offer.offers_visible.forEach((offerVisible, index) => {
    return (sliderInfo[offerVisible.ownOffer ? price : offerVisible.price] = {
      style: {
        marginTop: index % 2 ? -40 : 0,
      },
      label:
        offerVisible.bestOffer && offer.best_offer_is_own_offer ? (
          <Tooltip title={'Your Offer'}>
            <Tag color="blue">
              <img
                src={Medal}
                style={{ height: 13, width: 10 }}
                alt={'Offer'}
              />{' '}
              {offerVisible.price.toFixed(2)}
            </Tag>
          </Tooltip>
        ) : offerVisible.bestOffer ? (
          <Tooltip title={'Buy Box'}>
            <Tag color="green">
              <img
                src={Medal}
                style={{ height: 13, width: 10 }}
                alt={'Offer'}
              />{' '}
              {offerVisible.price.toFixed(2)}
            </Tag>
          </Tooltip>
        ) : offerVisible.ownOffer ? (
          <Tooltip title={'Your Offer'}>
            <Tag color="blue">{price}</Tag>
          </Tooltip>
        ) : (
          <Tag color="grey">{offerVisible.price.toFixed(2)}</Tag>
        ),
    });
  });

  return sliderInfo;
};

export default class PriceCheckerDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        chart: {
          type: 'area',
          height: 350,
        },
        markers: {
          size: 2,
          discrete: this.props.offer.updates.map((update, index) => {
            if (update.own_offer.bestOffer) {
              return {
                seriesIndex: 0,
                dataPointIndex: index,
                fillColor: '#00e396',
                strokeColor: '#fff',
                size: 6,
              };
            }
            return {};
          }),
        },
        stroke: {
          curve: 'stepline',
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 3,
          min: this.props.offer.updates[0]
            ? new Date(this.props.offer.updates[0].time_checked).getTime()
            : null,
          max:
            this.props.offer.updates.length < 5
              ? new Date(new Date().getTime() + 86400 * 10).getTime()
              : new Date().getTime(),
        },
        yaxis: {
          min: this.props.offer.price - this.props.offer.price * 0.1,
          max: this.props.offer.price + this.props.offer.price * 0.1,
          title: {
            text: 'Price',
          },
          labels: {
            style: {
              color: '#8e8da4',
            },
            offsetX: 0,
            formatter: (val, index) => {
              return Math.round(Number(val));
            },
          },
          tickAmount: 3,
          decimalsInFloat: 2,
        },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            let price = this.props.offer.updates[dataPointIndex].new_price;
            return renderToString(
              <div style={{ flexDirection: 'row', display: 'flex', border: 0 }}>
                <Card
                  title="Your Offer"
                  style={{
                    width: 175,
                  }}
                  headStyle={{
                    backgroundColor: '#008ffb',
                    color: '#fff',
                  }}
                  size="small"
                  bordered={false}
                >
                  <span>{price}</span>
                  <br />
                  <span>
                    {
                      this.props.offer.updates[dataPointIndex].own_offer
                        .sellerDisplayName
                    }
                  </span>
                </Card>
                <Card
                  title="Buy Box"
                  style={{ width: 175 }}
                  headStyle={{
                    backgroundColor: '#00e396',
                    color: '#fff',
                  }}
                  size="small"
                  bordered={false}
                >
                  <span>
                    {this.props.offer.updates[dataPointIndex].buy_box.price}
                  </span>
                  <br />
                  <span>
                    {
                      this.props.offer.updates[dataPointIndex].buy_box
                        .sellerDisplayName
                    }
                  </span>
                </Card>
              </div>
            );
          }.bind(this),
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.3,
            opacityTo: 0.5,
          },
        },
      },
    };
    this.marks = getSliderInfo(this.props.offer, this.props.offer.price);

    this.columns = [
      {
        title: 'Beoordeling',
        dataIndex: 'score',
        render: (value) => {
          return value >= 9 ? (
            <Tag color="green">{value}</Tag>
          ) : value >= 7 && value < 9 ? (
            <Tag color="gold">{value}</Tag>
          ) : (
            <Tag color="red">{value}</Tag>
          );
        },
      },
      {
        title: 'Competitor Name',
        dataIndex: 'sellerName',
      },
      {
        title: 'Prijs',
        dataIndex: 'price',
        render: (value, record) => {
          return record.bestOffer && record.ownOffer ? (
            <Tag color="blue">
              {' '}
              <img
                src={Medal}
                style={{ height: 13, width: 10 }}
                alt={'Medal'}
              />{' '}
              €{value.toFixed(2)}
            </Tag>
          ) : record.bestOffer ? (
            <Tag color="green">
              <img
                src={Medal}
                style={{ height: 13, width: 10 }}
                alt={'Medal'}
              />{' '}
              €{value.toFixed(2)}
            </Tag>
          ) : record.ownOffer ? (
            <Tag color="blue">
              {' '}
              €{value.toFixed(2)} | {record.price.toFixed(2)}
            </Tag>
          ) : (
            <span> €{value.toFixed(2)}</span>
          );
        },
      },
    ];
  }
  componentDidMount() {
    const dataOwnOffer = this.props.offer.updates.map((update, index) => {
      if (update.hasOwnProperty('own_offer')) {
        return [update.time_checked, update.new_price];
      }
      return null; // This removed an error, but did it cause a probelm?
    });
    const dataBuyBox = this.props.offer.updates.map((update) => {
      if (update.buy_box) {
        return [update.time_checked, update.buy_box.price];
      }
      return null; //This removed an error, but did it cause a probelm?
    });
    this.setState({
      series: [
        { data: dataOwnOffer, name: 'Your Offer' },
        { data: dataBuyBox, name: 'Buy Box' },
      ],
    });
  }
  render() {
    return (
      <Layout>
        <Row gutter={16}>
          <Col span={3}>
            <Box>
              <Typography.Title level={4}>Current Price</Typography.Title>
              <Typography.Text style={{ fontSize: 20 }}>
                €{this.props.offer.price.toFixed(2)}
              </Typography.Text>
            </Box>
          </Col>
          <Col span={3}>
            <Box>
              <Typography.Title level={4}>Commission</Typography.Title>
              <Typography.Text style={{ fontSize: 20 }}>
                €{this.props.offer.commission.totalCost.toFixed(2)}
              </Typography.Text>
            </Box>
          </Col>
          <Col span={6}>
            <Box>
              <Typography.Title level={4}>Minimum Price</Typography.Title>
              <Typography.Text style={{ fontSize: 20 }}>
                €{this.props.offer.min_price.toFixed(2)}
              </Typography.Text>
            </Box>
          </Col>
          <Col span={6}>
            <Box>
              <Typography.Title level={4}>Repricer Active</Typography.Title>
              <Typography.Text style={{ fontSize: 20 }}>
                {this.props.offer.repricer_active && (
                  <Tag color="green">ACTIVE</Tag>
                )}
                {!this.props.offer.repricer_active && (
                  <Tag color="orange">NOT ACTIVE</Tag>
                )}
              </Typography.Text>
            </Box>
          </Col>
          <Col span={6}>
            <Box>
              <Typography.Title level={4}>Settings</Typography.Title>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 5,
                  marginBottom: 5,
                }}
              >
                <Typography.Text style={{ fontSize: 16 }}>
                  Specifieke concurrentie selecteren
                </Typography.Text>
                <Switch
                  defaultChecked={this.props.offer.custom_selection_competitors}
                  onChange={this.props.saveCustomSelectionCompetitors}
                />
              </div>
            </Box>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={18}>
            <Box>
              {this.state.series.length > 0 && (
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="area"
                  height={350}
                />
              )}
            </Box>
          </Col>
          <Col span={6}>
            <Box
              style={{
                height: 412,
                maxHeight: 412,
                overflowY: 'scroll',
                overflowX: 'hidden',
              }}
            >
              <Table
                columns={this.columns}
                dataSource={this.props.competitorData}
                pagination={false}
                rowSelection={
                  this.props.offer.custom_selection_competitors ||
                  this.props.customSelectionCompetitors
                    ? {
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                          const selectedOffers = selectedRows.map((row) => {
                            return row.id;
                          });
                          this.props.onChange(
                            'selectedCompetitorsOffers',
                            selectedOffers
                          );
                        },
                        getCheckboxProps: (record) => ({
                          disabled:
                            record.sellerName === this.props.user.bol_shop_name
                              ? true
                              : false,
                          defaultChecked: this.props.offer.selected_competitors.find(
                            (offer) => {
                              return offer === record.id;
                            }
                          )
                            ? true
                            : false,
                        }),
                      }
                    : undefined
                }
              />

              {this.props.customSelectionCompetitors && (
                <Button onClick={this.props.saveSelectedCompetitors}>
                  Save Selected Competitors
                </Button>
              )}
            </Box>
          </Col>
        </Row>
        <Box>
          <Slider
            marks={this.marks}
            included={true}
            disabled
            defaultValue={[
              this.props.offer.min_price < this.marks[0]
                ? this.marks[0]
                : this.props.offer.min_price,
              this.props.offer.price + 5,
            ]}
            min={this.marks[0] - 1}
            range={true}
            max={this.marks[100] + 1}
          />
        </Box>
      </Layout>
    );
  }
}
