import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineMarkSeries,
  makeVisFlexible,
  Hint
} from 'react-vis';
import { Descriptions, Badge } from 'antd';
import PropTypes from 'prop-types';

const Plot = ({
  width,
  measurements,
  highestQuantity,
  lowestQuantity,
  setHint,
  value,
  onMouseLeave
}) => {
  return (
    <XYPlot
      onMouseLeave={onMouseLeave}
      height={400}
      width={width}
      yDomain={[
        lowestQuantity - 15 < 0 ? 0 : lowestQuantity - 15,
        highestQuantity + 15
      ]}
      xType="ordinal"
    >
      <HorizontalGridLines />
      <LineMarkSeries
        data={measurements}
        style={{
          strokeWidth: '2px'
        }}
        lineStyle={{ stroke: '#1890ff' }}
        markStyle={{ stroke: 'rgba(255, 255, 255)', fill: '#1890ff' }}
        onNearestX={setHint}
      />
      {value ? <Hint value={value} /> : null}
      <LineMarkSeries />
      <XAxis />
      <YAxis />
    </XYPlot>
  );
};
Plot.propTypes = {
  width: PropTypes.number,
  measurements: PropTypes.array,
  highestQuantity: PropTypes.number,
  lowestQuantity: PropTypes.number,
  setHint: PropTypes.func,
  value: PropTypes.object,
  onMouseLeave: PropTypes.func
};
const FlexibleXYPlot = makeVisFlexible(Plot);

export default class OfferView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [],
      price: [],
      highestQuantity: 0,
      lowestQuantity: 0,
      value: null
    };
  }

  async componentDidMount() {
    const data = await this.getGraphData(this.props.offer.updates);
    this.setState({
      stock: data.stock,
      price: data.price,
      lowestQuantity: data.lowestQuantity,
      highestQuantity: data.highestQuantity
    });
  }
  getGraphData = async data => {
    const stock = [];
    const price = [];
    let lowestQuantity = 0;
    let highestQuantity = 0;
    data.map(update => {
      if (update.quantity && update.price) {
        if (update.quantity < lowestQuantity) {
          lowestQuantity = update.quantity;
        }
        if (update.quantity > highestQuantity) {
          highestQuantity = update.quantity;
        }
        const date = new Date(update.time_checked);
        const hh = date.getHours();
        const dd = date.getDate();
        const mm = date.getMonth() + 1; //January is 0!
        const today = dd + '/' + mm + ' ' + hh + ':00';
        stock.push({ y: update.quantity, x: today });
        price.push({ y: update.price, x: today });
      }
    });
    return { stock, price, lowestQuantity, highestQuantity };
  };
  setHint = d => {
    this.setState({ value: d });
  };
  render() {
    if (this.state.stock) {
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
          <FlexibleXYPlot
            measurements={this.state.stock}
            highestQuantity={this.state.highestQuantity}
            lowestQuantity={this.state.lowestQuantity}
            setHint={this.setHint}
            value={this.state.value}
            onMouseLeave={() => {
              this.setState({ value: null });
            }}
          />
        </>
      );
    } else {
      return null;
    }
  }
}
