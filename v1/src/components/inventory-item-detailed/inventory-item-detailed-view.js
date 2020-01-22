import React from 'react';
import {
  Row,
  Col,
  Statistic,
  Typography,
  Descriptions,
  Switch,
  Select,
  Button,
  Icon,
  Input,
  InputNumber,
  Modal
} from 'antd';
import { Box } from '../../styles/style';
import BolItem from './bol-item';
const { Title, Text } = Typography;
const { Option } = Select;
export default class InventoryItemDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editStock: false,
      editProductName: false
    };
  }
  handleChosenBolOffer = value => {
    console.log(value);
    this.props.onChange('bolId', value);
  };
  componentDidMount() {}
  handleEditStock = () => {
    this.props.onChange('editStock', !this.state.editStock);
  };
  handleEditProductName = () => {
    this.props.onChange('editProductName', !this.state.editProductName);
  };
  handleProductNameChange = value => {
    this.props.onChange('productName', value.target.value);
  };
  handleStockChange = value => {
    this.props.onChange('stock', value);
  };
  render() {
    return (
      <>
        <Row gutter={[16, 16]}>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic
                title="Inventory"
                value={this.props.inventoryItem.stock}
              />
            </Box>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic title="Avg Profit Margin" value={'28%'} />
            </Box>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic
                title="Total Sold"
                value={this.props.inventoryItem.total_sold}
              />
            </Box>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Box>
              <Statistic title="Status" value={'Active'} />
            </Box>
          </Col>
        </Row>
        <Box>
          <Descriptions bordered>
            <Descriptions.Item label="Product Name" span={3}>
              {!this.props.editProductName && (
                <>
                  <Text>{this.props.inventoryItem.product_name}</Text>
                  <Icon
                    style={{ marginLeft: 10 }}
                    type="edit"
                    onClick={this.handleEditProductName}
                  />
                </>
              )}
              {this.props.editProductName && (
                <>
                  <Input
                    placeholder="Amount"
                    style={{ width: 300 }}
                    defaultValue={this.props.inventoryItem.product_name}
                    onChange={this.handleProductNameChange}
                  />
                  <Button
                    type="primary"
                    onClick={this.props.handleUpdateProductName}
                  >
                    Save
                  </Button>
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Available" span={3}>
              <Switch
                defaultChecked={this.props.inventoryItem.active ? true : false}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Stock" span={3}>
              {!this.props.editStock && (
                <>
                  <Text>{this.props.inventoryItem.stock}</Text>
                  <Icon
                    style={{ marginLeft: 10 }}
                    type="edit"
                    onClick={this.handleEditStock}
                  />
                </>
              )}
              {this.props.editStock && (
                <>
                  {' '}
                  <InputNumber
                    placeholder="Amount"
                    width={100}
                    defaultValue={this.props.inventoryItem.stock}
                    onChange={this.handleStockChange}
                  />
                  <Button type="primary" onClick={this.props.handleUpdateStock}>
                    Save
                  </Button>
                </>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Box>
        <Box>
          <BolItem {...this.props} />
        </Box>
      </>
    );
  }
}
