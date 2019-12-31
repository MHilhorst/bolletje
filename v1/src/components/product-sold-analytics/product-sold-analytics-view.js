import React from 'react';
import { Box } from '../../styles/style';
import { Input, Button, Table } from 'antd';
import { getTrackedProducts } from '../../utils/bol';

const columns = [
  {
    title: 'Product Image',
    dataIndex: 'productImage',
    key: 'productImage',
    render: (value, record) => {
      return <img src={value} width={50} height={50} />;
    }
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    title: 'EAN',
    dataIndex: 'ean',
    key: 'ean'
  },
  {
    title: 'Lowest Price',
    dataIndex: 'lowestPrice',
    key: 'lowestPrice'
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
    title: 'Average Sold / Day',
    dataIndex: 'avgSoldDay',
    key: 'avgSoldDay'
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
      productImage: product.img,
      productName: product.title,
      ean: product.ean,
      totalSellers: product.offer_ids.length,
      trackingSince: getFormattedDate(new Date(product.tracking_since)),
      lowestPrice: getLowestPrice(product.offer_ids),
      view: product.product_id,
      avgSoldDay: product.total_sold || 0
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
            <Input
              onChange={this.props.handleProductId}
              value={this.props.productId}
              style={{ width: 200 }}
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
