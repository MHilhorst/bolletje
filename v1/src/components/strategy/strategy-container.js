import React from 'react';
import StrategyView from './strategy-view';
import { getStrategies, deleteStrategies } from '../../utils/repricer';
export default class StrategyContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingAction: false,
      selectedExistingStrategies: [],
    };
  }

  async componentDidMount() {
    const data = await getStrategies();
    if (data) {
      console.log(data);
      const tableData = data.strategies.map((strategy) => {
        return {
          marketplace: 'bol.com',
          strategyName: strategy.strategy_name,
          strategyType: strategy.strategy_type,
          minimumType: strategy.minimum_pricing.pricing_type,
          minimumPercentage: strategy.minimum_pricing.percentage,
          activate: strategy.activated,
          id: strategy._id,
        };
      });
      this.setState({ strategies: data.strategies, tableData, loading: false });
    }
  }
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  handleAction = async () => {
    if (this.state.action === 'delete') {
      this.setState({ loadingAction: true });
      const data = await deleteStrategies(
        this.state.selectedExistingStrategies
      );
      if (data.success) {
        this.setState({ loadingAction: false });
        window.location.reload();
      }
    }
  };

  handleActionChange = (e) => {
    this.setState({ action: e });
  };
  render() {
    if (!this.state.loading) {
      return (
        <StrategyView
          {...this.state}
          onChange={this.onChange}
          handleAction={this.handleAction}
          handleActionChange={this.handleActionChange}
        />
      );
    } else {
      return null;
    }
  }
}
