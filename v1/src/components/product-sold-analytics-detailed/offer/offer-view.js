import React from 'react';
import { Descriptions } from 'antd';
import Chart from 'react-apexcharts';

export default class OfferView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        chart: {
          type: 'area',
          height: 350
        },
        stroke: {
          curve: 'stepline'
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow'
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 6
        },
        yaxis: {
          title: {
            text: 'Inventory'
          }
        },
        tooltip: {
          x: {
            format: 'dd/MM/yyyy HH:mm'
          },
          z: {
            title: 'Price:',
            formatter: y => {
              return '€' + y;
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        }
      }
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
      series: [{ data, name: 'Inventory' }]
    });
  }

  getGraphDatav2 = async data => {
    const stock = [];
    data.map(update => {
      stock.push([update.time_checked, update.quantity, update.price]);
    });
    return stock;
  };

  render() {
    if (this.state.series.length > 0) {
      return (
        <>
          <Descriptions
            title={this.props.offer.seller_display_name}
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
