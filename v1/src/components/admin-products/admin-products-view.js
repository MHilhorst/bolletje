import React from 'react';
import { Box } from '../../styles/style';
import { Table, Input, Pagination, Divider, Button } from 'antd';
import queryString from 'query-string';

const getFormattedDate = (date) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
};

const columns = [
  {
    title: 'Product ID',
    dataIndex: 'productId',
    key: 'productId',
    render: (value) => {
      return <a href={`/product-sold-analytics/${value}`}>{value}</a>;
    },
  },
  {
    title: 'Internal ID',
    dataIndex: 'internalId',
    key: 'internalId',
    render: (value) => {
      return <a href={`/admin/products/${value}`}>{value}</a>;
    },
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (value) => {
      return value.length > 80 ? value.slice(0, 80) : value;
    },
  },
  {
    title: 'Active Offers',
    dataIndex: 'activeOffersLength',
    key: 'activeOffersLength',
  },
  {
    title: 'Last Offer Check',
    dataIndex: 'lastOfferCheck',
    key: 'lastOfferCheck',
    render: (value) => {
      return <span>{Math.floor(value)} Minutes ago</span>;
    },
  },
  {
    title: 'Tracking Since',
    dataIndex: 'trackingSince',
    key: 'trackingSince',
    render: (value) => {
      return <span>{getFormattedDate(new Date(value))}</span>;
    },
  },
  // {
  //   title: 'Last Product Check',
  //   dataIndex: 'lastProductCheck',
  //   key: 'lastProductCheck',
  //   render: (value) => {
  //     return <span>{Math.floor(value)} Minutes ago</span>;
  //   },
  // },
  {
    title: 'Users Tracking',
    dataIndex: 'usersTracking',
    key: 'usersTracking',
  },
  { title: 'Total Offers', dataIndex: 'totalOffers', key: 'totalOffers' },
];
export default class AdminProductsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChangePagination = (e) => {
    this.props.changePagination(e);
  };

  handleSearchProducts = (e) => {
    this.props.searchProduct(e.target.value);
  };
  handleReload = () => {
    this.props.reload();
  };
  render() {
    return (
      <>
        <Box>
          <Input
            placeholder="Search Products"
            onChange={(e) => this.handleSearchProducts(e)}
            style={{ width: 200, marginBottom: 12 }}
          />
          <Table
            columns={columns}
            dataSource={this.props.tableData}
            pagination={{ position: 'none' }}
          />
          <div style={{ marginTop: 12 }}>
            <Pagination
              onChange={this.onChangePagination}
              total={this.props.totalProducts}
              defaultCurrent={Number(
                queryString.parse(window.location.search).page
              )}
            />
          </div>
          <Divider />
          <div style={{ marginTop: 12 }}>
            <Button
              onClick={this.handleReload}
              loading={this.props.reloadLoading}
            >
              Reload Products
            </Button>
          </div>
        </Box>
      </>
    );
  }
}
