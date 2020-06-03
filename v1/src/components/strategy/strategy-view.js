import React from 'react';
import { Box } from '../../styles/style';
import StrategyModal from './strategy-create';
import { Table, Switch, Select, Button } from 'antd';
import { activateStrategy } from '../../utils/repricer';

const { Option } = Select;
export default class StrategyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.columns = [
      {
        title: 'Marketplace',
        dataIndex: 'marketplace',
        key: 'marketplace',
        render: (value) => {
          if (value === 'bol.com') {
            return (
              <img src={require('../../assets/images/bol.png')} width={80} />
            );
          }
        },
      },
      {
        title: 'Strategy Name',
        dataIndex: 'strategyName',
        key: 'strategyName',
      },
      {
        title: 'Strategy Type',
        dataIndex: 'strategyType',
        key: 'strategyType',
        render: (value) => {
          if (value === 'datafeed') {
            return 'Datafeed';
          }
          if (value === 'targetBuyBox') {
            return 'Buy Box Targeting';
          }
          if (value === 'lowestPriceOffer') {
            return 'Lowest Offer Targeting';
          }
        },
      },
      {
        title: 'Minimum Type Listing Price',
        dataIndex: 'minimumType',
        key: 'minimumType',
      },
      {
        title: 'Minimum Percentage Listing Price',
        dataIndex: 'minimumPercentage',
        key: 'minimumPercentage',
      },
      {
        title: 'Activate',
        dataIndex: 'activate',
        key: 'activate',
        render: (value, record) => {
          return (
            <Switch
              defaultChecked={value}
              onChange={(e) => this.changeActivationBooleanStrategy(e, record)}
            />
          );
        },
      },
    ];
  }
  changeActivationBooleanStrategy = async (e, record) => {
    const data = await activateStrategy(record.id, e);
  };

  render() {
    return (
      <>
        <Box>
          <StrategyModal />
        </Box>
        <Box>
          {this.props.selectedExistingStrategies.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Select
                style={{ width: 180 }}
                onChange={this.props.handleActionChange}
              >
                <Option value="delete">Delete</Option>
              </Select>
              <Button
                style={{ marginLeft: 6 }}
                loading={this.props.loadingAction}
                onClick={this.props.handleAction}
              >
                Submit
              </Button>
            </div>
          )}
          <Table
            columns={this.columns}
            dataSource={this.props.tableData}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                const selectedExistingStrategies = selectedRows.map((row) => {
                  return row.id;
                });
                this.props.onChange(
                  'selectedExistingStrategies',
                  selectedExistingStrategies
                );
              },
            }}
          />
        </Box>
      </>
    );
  }
}
