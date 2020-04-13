import React from 'react';
import { Box } from '../../styles/style';
import { Table, Tooltip, Icon } from 'antd';
const columns = [
  {
    title: 'Product Image',
    dataIndex: 'productImage',
    key: 'productImage',
    render: (value, record) => {
      return <img alt={value} src={value} width={50} height={50} />;
    },
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
    render: (value, record) => {
      return <a href={`/product-sold-analytics/${record.view}`}>{value}</a>;
    },
  },
  {
    title: 'EAN',
    dataIndex: 'ean',
    key: 'ean',
  },
  {
    title: 'Lowest Price',
    dataIndex: 'lowestPrice',
    key: 'lowestPrice',
    render: (value) => {
      return value ? <span>€ {value}</span> : <span>Not Available</span>;
    },
  },
  {
    title: 'Tracking Since',
    dataIndex: 'trackingSince',
    key: 'trackingSince',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => {
      return (
        new Date(a.trackingSince).getTime() -
        new Date(b.trackingSince).getTime()
      );
    },
  },
  {
    title: 'Total sellers',
    dataIndex: 'totalSellers',
    key: 'totalSellers',
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
    key: 'avgSoldDay',
    defaultSortOrder: 'descend',
    sorter: (a, b) => {
      return a.avgSoldDay - b.avgSoldDay;
    },
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
    dataIndex: 'monthlySales',
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
    dataIndex: 'monthlyRevenue',
    defaultSortOrder: 'descend',
    sorter: (a, b) => {
      return (
        Number(a.monthlyRevenue.replace('€ ', '')) -
        Number(b.monthlyRevenue.replace('€ ', ''))
      );
    },
  },
  {
    title: (
      <Tooltip placement="top" title={'This is an estimated'}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon type="info-circle" width={12} style={{ marginRight: 5 }} />
          <span>Total Sold</span>
        </div>
      </Tooltip>
    ),
    key: 'totalSold',
    dataIndex: 'totalSold',
    defaultSortOrder: 'descend',
    sorter: (a, b) => {
      return a.totalSold - b.totalSold;
    },
  },
  {
    title: 'View',
    key: 'view',
    render: (value) => {
      return (
        <span>
          <a href={`/product-sold-analytics/${value.view}`}>View</a>
        </span>
      );
    },
  },
];
const getFormattedDate = (date) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
};

const getLowestPrice = (offer_ids) => {
  let minValue = offer_ids[0].price;
  for (var i = 0; i < offer_ids.length; i++) {
    if (offer_ids[i].price < minValue) {
      minValue = offer_ids[i].price;
    }
  }
  return minValue;
};

const setTableData = async (products) => {
  return products.map((product) => {
    return {
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
          (product.total_sold /
            ((new Date().getTime() -
              new Date(product.tracking_since).getTime()) /
              1000 /
              86400)) *
            30 *
            (product.offer_ids.length > 0
              ? getLowestPrice(product.offer_ids)
              : 0
            ).toFixed(2)
        ),
      trackingSince: getFormattedDate(new Date(product.tracking_since)),
      lowestPrice:
        product.offer_ids.length > 0
          ? getLowestPrice(product.offer_ids)
          : false,
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
        ) || 0,
      totalSold: product.total_sold,
    };
  });
};

// const productsTableScheme = [];
// products.map((product) => {
//   const tableProductEntry = {
//     url: product.url,
//     productImage: product.img,
//     productName: product.title,
//     ean: product.ean,
//     totalSellers: product.offer_ids.length,
//     monthlySales:
//       Math.round(
//         product.total_sold /
//           Math.round(
//             (new Date().getTime() -
//               new Date(product.tracking_since).getTime()) /
//               1000 /
//               86400
//           )
//       ) * 30,
//     monthlyRevenue:
//       '€ ' +
//       Math.round(
//         (product.total_sold /
//           ((new Date().getTime() -
//             new Date(product.tracking_since).getTime()) /
//             1000 /
//             86400)) *
//           30 *
//           (product.offer_ids.length > 0
//             ? getLowestPrice(product.offer_ids)
//             : 0
//           ).toFixed(2)
//       ),
//     trackingSince: getFormattedDate(new Date(product.tracking_since)),
//     lowestPrice:
//       product.offer_ids.length > 0
//         ? getLowestPrice(product.offer_ids)
//         : false,
//     view: product.product_id,
//     avgSoldDay:
//       Math.round(
//         product.total_sold /
//           Math.round(
//             (new Date().getTime() -
//               new Date(product.tracking_since).getTime()) /
//               1000 /
//               86400
//           )
//       ) || 0,
//     totalSold: product.total_sold,
//   };
//   productsTableScheme.push(tableProductEntry);
// });
// return productsTableScheme;
export default class ProductSoldAnalyticsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: false,
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
            <Table dataSource={this.state.tableData} columns={columns} />
          </Box>
        </>
      );
    } else {
      return null;
    }
  }
}
