import React from "react";
import { Row, Col, Table, Typography } from "antd";
import { Box } from "../../styles/style";

const { Text } = Typography;

export default class PluginAliExpressView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: "Product Image",
        dataIndex: "productImage",
        key: "productImage",
        render: value => <img src={value} width={150} />
      },
      { title: "Product Name", dataIndex: "productName", key: "productName" },
      {
        title: "Product Price",
        dataIndex: "productPrice",
        key: "productPrice",
        render: value => {
          return <span>{(value.sale * 0.9).toFixed(2)}</span>;
        }
      }
    ];
  }
  componentDidMount() {}
  render() {
    return (
      <>
        {this.props.products.map(product => {
          console.log(product);
          return (
            <Box>
              <div style={{ display: "flex" }}>
                <img src={product.imageUrl} style={{ height: 150 }} />
                <div style={{ marginLeft: 15 }}>
                  <Text strong style={{ fontSize: 16 }}>
                    {product.name}
                  </Text>
                  <br />
                  <Text>sdasd</Text>
                </div>
              </div>
            </Box>
          );
        })}
        {/* <Table dataSource={this.props.tableData} columns={this.columns} /> */}

        {/* <Row gutter={16}>
          {this.props.products.map(product => {
            return (
              <Col sm={24} md={4} lg={4} xl={4}>
                <Box>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={product.imageUrl} width={'80%'} height={200} />
                  </div>
                </Box>
              </Col>
            );
          })}
        </Row> */}
      </>
    );
  }
}
