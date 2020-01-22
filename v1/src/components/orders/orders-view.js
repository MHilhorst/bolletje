import React from 'react';
import { Box } from '../../styles/style';
import { Table, Tag } from 'antd';

export default class OrdersView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: value => {
          return <Tag color="green">Open</Tag>;
        }
      },
      { title: 'Platform', dataIndex: 'platform', key: 'platform' },
      { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
      { title: 'Bol Order Id', dataIndex: 'bolOrderId', key: 'bolOrderId' },
      { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: value => <a href={`/order/${value.orderId}`}>View</a>
      }
    ];
  }
  render() {
    return (
      <>
        <Box>
          <Table columns={this.columns} dataSource={this.props.bolTableData} />
        </Box>
      </>
    );
  }
}
