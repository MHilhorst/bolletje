import React from 'react';
import { Box } from '../../styles/style';
import { renderToString } from 'react-dom/server';
import { Table, Button, Switch, Card } from 'antd';
import Chart from 'react-apexcharts';

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
          min:
            this.props.offer.updates[0].own_offer.price -
            this.props.offer.updates[0].own_offer.price * 0.1,
          max:
            this.props.offer.updates[0].own_offer.price +
            this.props.offer.updates[0].own_offer.price * 0.1,
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
            let price = this.props.offer.updates[dataPointIndex].own_offer
              .price;
            console.log(this.props.offer.updates[dataPointIndex].own_offer);
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
            // '<div class="arrow_box">' +
            // '<span class="tooltip_header">' +
            // 'Update Information' +
            // '</span>' +
            // '<br />' +
            // '<span class="tooltip_body">' +
            // 'Your Price: ' +
            // price +
            // '</span>' +
            // '<br />' +
            // '<span class="tooltip_body">' +
            // 'Buy Box: ' +
            // buy_box +
            // '</span>' +
            // '</div>'
          }.bind(this),
          // x: {
          //   format: 'dd/MM/yyyy HH:mm',
          // },
          // y: {
          //   formatter: (y, dataIndex) => {
          //     console.log(y, dataIndex);
          //     return y;
          //   },
          // },
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
    this.columns = [
      {
        title: 'Beoordeling',
        dataIndex: 'score',
      },
      {
        title: 'Competitor Name',
        dataIndex: 'sellerName',
      },
      {
        title: 'Prijs',
        dataIndex: 'price',
      },
    ];
  }
  componentDidMount() {
    const dataOwnOffer = this.props.offer.updates.map((update, index) => {
      if (update.hasOwnProperty('own_offer')) {
        return [update.time_checked, update.own_offer.price];
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
      <>
        <Box>
          {this.props.offer.offer_id}
          {this.state.series.length > 0 && (
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="area"
              height={350}
            />
          )}
        </Box>
        <Box>
          <Switch
            defaultChecked={this.props.offer.custom_selection_competitors}
            onChange={this.props.saveCustomSelectionCompetitors}
          />
          <Table
            columns={this.columns}
            dataSource={this.props.competitorData}
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
      </>
    );
  }
}
