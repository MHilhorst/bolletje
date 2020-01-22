import React from 'react';
import { Layout, Col, Typography, Form, Input, Button } from 'antd';
import { Box } from '../../styles/style';

const { Title, Text } = Typography;
export default class CreateInventoryItemView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleName = value => {
    this.props.onChange('productName', value.target.value);
  };
  handleStock = value => {
    this.props.onChange('stock', value.target.value);
  };
  handlePlatform = value => {
    this.props.onChange('platformAvailable', [value.target.value]);
  };
  render() {
    return (
      <Layout>
        <Col
          sm={{ span: 24, offset: 0 }}
          md={{ span: 16, offset: 4 }}
          lg={{ span: 16, offset: 4 }}
          style={{ marginTop: 20 }}
        >
          <Title level={4}>Create new inventory item</Title>
          <Box>
            <Form className="login-form">
              <Form.Item>
                <Text strong>Product Name</Text>
                <Input
                  placeholder="Type Product Name"
                  onChange={this.handleName}
                />
              </Form.Item>
              <Form.Item>
                <Text strong>Stock</Text>
                <Input placeholder="Type Number" onChange={this.handleStock} />
              </Form.Item>
              <Form.Item>
                <Text strong>Platforms</Text>
                <Input
                  placeholder="Type Platforms to Sell on"
                  onChange={this.handlePlatform}
                />
              </Form.Item>
            </Form>
            <Button type="primary" onClick={this.props.submit}>
              Submit
            </Button>
          </Box>
        </Col>
      </Layout>
    );
  }
}
