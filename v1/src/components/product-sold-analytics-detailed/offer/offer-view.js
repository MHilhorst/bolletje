import React from 'react';
import { Descriptions, Tag } from 'antd';
import Chart from 'react-apexcharts';

const checkActive = (active_offers, offerId, bol) => {
  // let offer;
  // if (bol === 'bol.com') {
  //   let offerIdString = offerId.toString();
  //   let lastChar = Number(offerIdString.substr(offerIdString.length - 1)) + 1;
  //   offer = offerIdString.replace(/.$/, lastChar.toString());
  // } else {
  //   offer = offerId.toString();
  // }
  if (bol === 'bol.com' && active_offers.length > 0) {
    return true;
  }
  // console.log(offer, active_offers);
  if (active_offers.includes(offerId.toString())) {
    return true;
  } else {
    return false;
  }
};

export default class OfferView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        chart: {
          type: 'area',
          height: 350,
        },
        stroke: {
          curve: 'stepline',
        },
        dataLabels: {
          enabled: false,
        },

        xaxis: {
          type: 'datetime',
          tickAmount: 10,
          min: this.props.offer.updates[0]
            ? new Date(this.props.offer.updates[0].time_checked).getTime()
            : null,
          max:
            this.props.offer.updates.length < 5
              ? new Date(new Date().getTime() + 86400 * 10).getTime()
              : new Date().getTime(),
          // : this.props.offer.last_update
          // ? new Date().getTime()
          // : // ? new Date(
          //   //     new Date(this.props.offer.last_update).getTime() + 86400 * 300
          //   // ).getTime()
          //   new Date().getTime(),
        },
        yaxis: {
          title: {
            text: 'Inventory',
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
        },
        // points: [
        //   {
        //     x: new Date().getTime(),
        //     y: 30,
        //     marker: {
        //       size: 80,
        //     },
        //     label: {
        //       borderColor: '#FF4560',
        //       text: 'Point Annotation',
        //     },
        //   },
        // ],
        tooltip: {
          x: {
            format: 'dd/MM/yyyy HH:mm',
          },
          z: {
            title: 'Price:',
            formatter: (y) => {
              return '€' + y;
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },
      // selection: "one_year"
    };
  }
  componentWillReceiveProps(newProps) {
    const curve = { curve: newProps.graphType };
    const options = { ...this.state.options };
    options.stroke = curve;
    this.setState({ options });
  }
  async componentDidMount() {
    const data = await this.getGraphDatav2(this.props.offer.updates);
    this.setState({
      series: [{ data, name: 'Inventory' }],
    });
  }

  getGraphDatav2 = async (data) => {
    const graphData = data.map((update, index) => {
      // if (index === 0) {
      //   return [update.time_checked, 0, update.price];
      // }
      return [update.time_checked, update.quantity, update.price];
    });
    graphData.unshift([graphData[0][0] - 1000, 0, graphData[0][2]]);
    return graphData;
  };

  render() {
    if (this.state.series.length > 0) {
      return (
        <>
          <Descriptions
            title={
              checkActive(
                this.props.product.active_offers,
                this.props.offer.public_offer_id,
                this.props.offer.seller_display_name
              ) ? (
                <>
                  <span>{this.props.offer.seller_display_name} </span>
                  {/* <Badge
                    className="site-badge-count-109"
                    count={'Active Offer'}
                    style={{ backgroundColor: '#52c41a' }}
                  /> */}
                  <Tag color="green">Active offer</Tag>
                </>
              ) : (
                <div>
                  <span>{this.props.offer.seller_display_name} </span>
                  {/* <Badge
                    count={'Inactive Offer'}
                    style={{ backgroundColor: '#faad14' }}
                  /> */}
                  <Tag color="orange">Inactive offer</Tag>
                </div>
              )
            }
            bordered
            style={{ marginBottom: 30 }}
          >
            <Descriptions.Item label="Price">
              {this.props.offer.price}
            </Descriptions.Item>
            <Descriptions.Item label="Stock">
              {this.props.offer.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Sold">
              {this.props.offer.total_sold || 0}
            </Descriptions.Item>
          </Descriptions>

          <Chart
            options={this.state.options}
            series={this.state.series}
            type="area"
            height={350}
          />
        </>
      );
    } else {
      return null;
    }
  }
}
