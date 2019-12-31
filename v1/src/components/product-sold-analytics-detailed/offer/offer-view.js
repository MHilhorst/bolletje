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
import PropTypes from 'prop-types';

const Plot = ({ width, measurements }) => {
  return (
    <XYPlot height={250} width={width} yDomain={[0, 20]} xType="ordinal">
      <HorizontalGridLines />
      <LineMarkSeries
        data={measurements}
        style={{
          strokeWidth: '2px'
        }}
        lineStyle={{ stroke: '#1890ff' }}
        markStyle={{ stroke: 'rgba(255, 255, 255)', fill: '#1890ff' }}
      />
      <LineMarkSeries />
      <XAxis />
      <YAxis />
    </XYPlot>
  );
};
Plot.propTypes = {
  width: PropTypes.number,
  measurements: PropTypes.array
};
const FlexibleXYPlot = makeVisFlexible(Plot);

export default class OfferView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [],
      price: []
    };
  }

  async componentDidMount() {
    const data = await this.getGraphData(this.props.offer.updates);
    this.setState({ stock: data.stock, price: data.price });
  }
  getGraphData = async data => {
    const stock = [];
    const price = [];
    let xCoord = 0;
    data.map(update => {
      if (update.quantity && update.price) {
        const date = new Date(update.time_checked);
        const hh = date.getHours();
        const dd = date.getDate();
        const mm = date.getMonth() + 1; //January is 0!
        const yyyy = date.getFullYear();
        const today = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':00';
        stock.push({ y: update.quantity, x: today });
        price.push({ y: update.price, x: today });
      }
    });
    return { stock, price };
  };
  render() {
    if (this.state.stock) {
      return <FlexibleXYPlot measurements={this.state.stock} />;
    } else {
      return null;
    }
  }
}
