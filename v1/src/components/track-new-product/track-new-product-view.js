import React from 'react';
import { Box } from '../../styles/style';
import { Typography, Divider, Input, Button, Col, Alert, Layout } from 'antd';

const { Title, Text } = Typography;
export default class TrackNewProductView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleProductIDChange = (e) => {
    this.props.onChange('productId', e.target.value);
  };
  render() {
    return (
      <Layout>
        <Col
          sm={{ span: 24, offset: 0 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 12, offset: 6 }}
          style={{ marginTop: 20 }}
        >
          <Box>
            <Title level={3}>Track New Product</Title>
            <Text>
              Copy the exact link of the Bol.com Product or give the numeric
              Product ID displayed in the link of the Bol.com product
            </Text>
            <Divider />
            <Input
              onChange={this.handleProductIDChange}
              value={this.props.productId}
              addonBefore={'Product ID'}
              placeholder="https://www.bol.com/nl/p/apple-airpods-2-met-draadloze-oplaadcase-wit/9200000108283772/ or 9200000108283772"
            />
            {this.props.error && (
              <Alert
                message="Error product already in your account"
                type="error"
              />
            )}
            <Button
              type="primary"
              onClick={this.props.handleSubmit}
              style={{ marginTop: 18 }}
            >
              Submit
            </Button>
          </Box>
        </Col>
      </Layout>
    );
  }
}
