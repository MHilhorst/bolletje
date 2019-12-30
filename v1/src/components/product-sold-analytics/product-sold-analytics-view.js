import React from "react";
import { Box } from "../../styles/style";
import { Input, Button, Table } from "antd";
import { getTrackedProducts } from "../../utils/bol";

const columns = [
  {
    title: "Product Image",
    dataIndex: "productImage",
    key: "productImage",
    render: (value, record) => {
      return <img src={value} />;
    }
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName"
  },
  {
    title: "EAN",
    dataIndex: "ean",
    key: "ean"
  },
  {
    title: "Lowest Price",
    dataIndex: "lowestPrice",
    key: "lowestPrice"
  },
  {
    title: "Tracking Since",
    dataIndex: "trackingSince",
    key: "trackingSince"
  },
  {
    title: "Total sellers",
    dataIndex: "totalSellers",
    key: "totalSellers"
  },
  {
    title: "Average Sold / Day",
    dataIndex: "avgSoldDay",
    key: "avgSoldDay"
  },
  {
    title: "View",
    key: "view",
    render: () => (
      <span>
        <a>View</a>
        <a>Configure</a>
      </span>
    )
  }
];

const setTableData = async products => {
  const productsTableScheme = [];
  products.map(product => {
    console.log(product);
    const tableProductEntry = {
      productImage: product.img,
      productName: product.title,
      ean: product.ean
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
    const products = await getTrackedProducts();
    const table = await setTableData(products);
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
