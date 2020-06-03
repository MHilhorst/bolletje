import React from 'react';
import StrategyCreateView from './strategy-create-view';

export default class StrategyCreateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <StrategyCreateView {...this.props} />;
  }
}
