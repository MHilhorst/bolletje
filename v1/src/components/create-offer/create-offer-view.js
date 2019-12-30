import React from "react";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Typography,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from "antd";
import { Box } from "../../styles/style";
const { Option } = Select;
const { Text } = Typography;
const conditions = ["NEW", "AS_NEW", "GOOD", "REASONABLE", "MODERATE"];
const fulfilments = [
  "24uurs-23",
  "24uurs-22",
  "24uurs-21",
  "24uurs-20",
  "24uurs-19",
  "24uurs-18",
  "24uurs-17",
  "24uurs-16",
  "24uurs-15",
  "24uurs-14",
  "24uurs-13",
  "24uurs-12",
  "1-2d",
  "2-3d",
  "3-5d",
  "4-8d",
  "1-8d",
  "MijnLeverbelofte"
];
export default class CreateOfferView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Row>
        <Col span={12}>
          <Box>
            <Form className="login-form">
              <Form.Item>
                <Text strong>EAN Product Number</Text>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="EAN"
                  onChange={this.props.handleEAN}
                />
              </Form.Item>
              <Form.Item>
                <Text strong>Product condition</Text>
                <Select
                  defaultValue="NEW"
                  onChange={this.props.handleCondition}
                >
                  {conditions.map(item => {
                    return <Option value={item}>{item}</Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item>
                <Text strong>Product Price</Text>

                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Price"
                  onChange={this.props.handlePrice}
                />
              </Form.Item>
              <Form.Item>
                <Text strong>Product Stock available</Text>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Stock amount"
                  onChange={this.props.handleStockAmount}
                />
              </Form.Item>
              <Form.Item>
                <Text strong>Product Fulfilment Type</Text>
                <Select
                  defaultValue={fulfilments[0]}
                  onChange={this.props.handleFulfilment}
                >
                  {fulfilments.map(item => {
                    return <Option value={item}>{item}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Form>
            <Button
              type="primary"
              style={
                this.props.postOfferSuccess
                  ? { backgroundColor: "#26de81", borderColor: "#26de81" }
                  : this.props.postOfferError
                  ? { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }
                  : null
              }
              loading={this.props.loadingPostOffer}
              onClick={this.props.handleSubmit}
            >
              {this.props.postOfferSuccess
                ? "Success"
                : this.props.postOfferError
                ? "Error"
                : "Submit"}
            </Button>
          </Box>
        </Col>
      </Row>
    );
  }
}
