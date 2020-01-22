import React from 'react';
import { Box } from '../../styles/style';
import { Table } from 'antd';
import { deleteInventoryItem } from '../../utils/inventory';

export default class InventoryOverviewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedOffer: null
    };
    this.columns = [
      {
        title: 'Platform',
        dataIndex: 'platform',
        key: 'platform',
        render: (value, record) => {
          return (
            <>
              {record.info.bol_id && (
                <img src={require(`../../assets/images/bol.png`)} width={80} />
              )}
              {record.info.bol_id && (
                <img src={require(`../../assets/images/mp.png`)} width={130} />
              )}
            </>
          );
        }
      },
      {
        title: 'Inventory Item ID',
        dataIndex: 'inventoryItemId',
        key: 'inventoryItemId'
      },
      {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'Current Stock',
        dataIndex: 'currentStock',
        key: 'currentStock'
      },
      {
        title: 'Configure',
        key: 'configure',
        render: (value, record) => {
          return (
            <span>
              <a onClick={() => this.handleDelete(record)}>Delete</a>
              <br />
              <a
                onClick={() =>
                  this.props.history.push(`/inventory/${value.inventoryItemId}`)
                }
              >
                View
              </a>
            </span>
          );
        }
      }
    ];
  }
  handleDelete = async item => {
    const data = await deleteInventoryItem(item.inventoryItemId);
    if (data.success) {
      this.props.refreshInventoryItems();
    }
  };
  render() {
    return (
      <>
        <Box>
          <Table dataSource={this.props.tableOffers} columns={this.columns} />
        </Box>
      </>
    );
  }
}
