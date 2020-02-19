import React from 'react';
import { Box } from '../../styles/style';
import { Input, Button, Table, Tooltip, Icon, Typography } from 'antd';
const { Title, Text } = Typography;
const columns = [
  {
    title: 'Product Image',
    dataIndex: 'productImage',
    key: 'productImage',
    render: (value, record) => {
      return <img alt={value} src={value} width={50} height={50} />;
    }
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
    render: (value, record) => {
      return <a href={record.url}>{value}</a>;
    }
  },
  {
    title: 'EAN',
    dataIndex: 'ean',
    key: 'ean'
  },
  {
    title: 'Lowest Price',
    dataIndex: 'lowestPrice',
    key: 'lowestPrice',
    render: value => {
      return <span>€ {value}</span>;
    }
  },
  {
    title: 'Tracking Since',
    dataIndex: 'trackingSince',
    key: 'trackingSince'
  },
  {
    title: 'Total sellers',
    dataIndex: 'totalSellers',
    key: 'totalSellers'
  },
  {
    title: (
      <Tooltip placement="top" title={'This is an estimated'}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon type="info-circle" width={12} style={{ marginRight: 5 }} />
          <span>Average Sold / Day</span>
        </div>
      </Tooltip>
    ),
    dataIndex: 'avgSoldDay',
    key: 'avgSoldDay'
  },
  {
    title: (
      <Tooltip placement="top" title={'This is an estimated'}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon type="info-circle" width={12} style={{ marginRight: 5 }} />
          <span>Monthly sales</span>
        </div>
      </Tooltip>
    ),
    key: 'monthlySales',
    dataIndex: 'monthlySales'
  },
  {
    title: (
      <Tooltip placement="top" title={'This is an estimated'}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon type="info-circle" width={12} style={{ marginRight: 5 }} />
          <span>Monthly Revenue</span>
        </div>
      </Tooltip>
    ),
    key: 'monthlyRevenue',
    dataIndex: 'monthlyRevenue'
  },
  {
    title: 'View',
    key: 'view',
    render: value => {
      return (
        <span>
          <a href={`/product-sold-analytics/${value.view}`}>View</a>
        </span>
      );
    }
  }
];
const getFormattedDate = date => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date
    .getDate()
    .toString()
    .padStart(2, '0');

  return month + '/' + day + '/' + year;
};

const getLowestPrice = offer_ids => {
  let minValue = offer_ids[0].price;
  for (var i = 0; i < offer_ids.length; i++) {
    if (offer_ids[i].price < minValue) {
      minValue = offer_ids[i].price;
    }
  }
  return minValue;
};

const setTableData = async products => {
  const productsTableScheme = [];
  products.map(product => {
    const tableProductEntry = {
      url: product.url,
      productImage: product.img,
      productName: product.title,
      ean: product.ean,
      totalSellers: product.offer_ids.length,
      monthlySales:
        Math.round(
          product.total_sold /
            Math.round(
              (new Date().getTime() -
                new Date(product.tracking_since).getTime()) /
                1000 /
                86400
            )
        ) * 30,
      monthlyRevenue:
        '€ ' +
        Math.round(
          product.total_sold /
            Math.round(
              (new Date().getTime() -
                new Date(product.tracking_since).getTime()) /
                1000 /
                86400
            )
        ) *
          30 *
          (product.offer_ids.length > 0
            ? getLowestPrice(product.offer_ids)
            : 0),
      trackingSince: getFormattedDate(new Date(product.tracking_since)),
      lowestPrice:
        product.offer_ids.length > 0
          ? getLowestPrice(product.offer_ids)
          : 'Not available',
      view: product.product_id,
      avgSoldDay:
        Math.round(
          product.total_sold /
            Math.round(
              (new Date().getTime() -
                new Date(product.tracking_since).getTime()) /
                1000 /
                86400
            )
        ) || 0
    };
    productsTableScheme.push(tableProductEntry);
  });
  return productsTableScheme;
};
export default class ProductSoldAnalyticsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: false
    };
  }
  async componentDidMount() {
    const table = await setTableData(this.props.products);
    this.setState({ tableData: table });
  }
  render() {
    if (this.state.tableData) {
      return (
        <>
          <Box>
            <Title level={4} style={{ fontSize: 18 }}>
              Analyze New Product {this.props.products.length}/
              {this.props.user.max_track_items}
            </Title>
            <Input
              onChange={this.props.handleProductId}
              value={this.props.productId}
              style={{ width: 200, marginRight: 10 }}
            />
            <Button type="primary" onClick={this.props.handleTrackNewProduct}>
              Submit
            </Button>
          </Box>
          <Box>
            <Table dataSource={this.state.tableData} columns={columns} />
          </Box>
        </>
      );
    } else {
      return null;
    }
  }
}
