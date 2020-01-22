import React from 'react';
import { Box } from '../../styles/style';
import { Descriptions, Typography, Tag, Table } from 'antd';
const { Title, Text } = Typography;
export default class OrderDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      { title: 'Product Name', dataIndex: 'productName', key: 'ean' },
      { title: 'ean', dataIndex: 'ean', key: 'ean' },
      { title: 'quantity', dataIndex: 'quantity', key: 'quantity' },
      {
        title: 'Latest Delivery Date',
        dataIndex: 'latestDeliveryDate',
        key: 'latestDeliveryDate'
      },
      { title: 'Expiry date', dataIndex: 'expiryDate', key: 'expiryDate' }
    ];
  }
  render() {
    console.log(this.props.order);
    return (
      <>
        <Box>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}
          >
            <Text style={{ fontSize: 20, color: '#000000d9' }} strong>
              Order Details #{this.props.order._id}{' '}
            </Text>
            <Tag color="green" style={{ marginLeft: 10 }}>
              {this.props.order.status}
            </Tag>
          </div>

          <Descriptions bordered style={{ marginBottom: 20 }}>
            <Descriptions.Item label="Order ID" span={3}>
              {this.props.order._id}
            </Descriptions.Item>
            <Descriptions.Item label={'Status'} span={3}>
              <Tag
                color={this.props.order.status === 'OPEN' ? 'green' : 'blue'}
              >
                {this.props.order.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                this.props.order.platform === 'bol' ? 'Bol.com Order ID' : ''
              }
              span={3}
            >
              {this.props.order.order_id}
            </Descriptions.Item>
            <Descriptions.Item label="Order Date" span={3}>
              {this.props.order.order_date}
            </Descriptions.Item>
          </Descriptions>
        </Box>

        <Box>
          <Title level={4}>Customer Details</Title>
          <Descriptions bordered style={{ marginBottom: 20 }}>
            <Descriptions.Item label="First Name" span={1}>
              {this.props.order.customer_details.billingDetails.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Sur Name" span={1}>
              {this.props.order.customer_details.billingDetails.surName}
            </Descriptions.Item>
            <Descriptions.Item label="Gender" span={1}>
              {this.props.order.customer_details.billingDetails.salutationCode}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={1}>
              {this.props.order.customer_details.billingDetails.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number" span={2}>
              {this.props.order.customer_details.billingDetails.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Street Name" span={1}>
              {this.props.order.customer_details.billingDetails.streetName}
            </Descriptions.Item>
            <Descriptions.Item label="House Number" span={1}>
              {this.props.order.customer_details.billingDetails.houseNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Zip Code" span={1}>
              {this.props.order.customer_details.billingDetails.zipCode}
            </Descriptions.Item>
            <Descriptions.Item label="City" span={1}>
              {this.props.order.customer_details.billingDetails.city}
            </Descriptions.Item>
            <Descriptions.Item label="Country Code" span={1}>
              {this.props.order.customer_details.billingDetails.countryCode}
            </Descriptions.Item>
          </Descriptions>
          <Title level={4}>Shipment Details</Title>
          <Descriptions bordered>
            <Descriptions.Item label="First Name" span={1}>
              {this.props.order.customer_details.shipmentDetails.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Sur Name" span={1}>
              {this.props.order.customer_details.shipmentDetails.surName}
            </Descriptions.Item>
            <Descriptions.Item label="Gender" span={1}>
              {this.props.order.customer_details.shipmentDetails.salutationCode}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={1}>
              {this.props.order.customer_details.shipmentDetails.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number" span={2}>
              {this.props.order.customer_details.shipmentDetails.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Street Name" span={1}>
              {this.props.order.customer_details.shipmentDetails.streetName}
            </Descriptions.Item>
            <Descriptions.Item label="House Number" span={1}>
              {this.props.order.customer_details.shipmentDetails.houseNumber}
            </Descriptions.Item>
            <Descriptions.Item label="House Number Extended" span={1}>
              {
                this.props.order.customer_details.shipmentDetails
                  .houseNumberExtended
              }
            </Descriptions.Item>
            <Descriptions.Item label="Extra Address Information" span={3}>
              {
                this.props.order.customer_details.shipmentDetails
                  .extraAddressInformation
              }
            </Descriptions.Item>
            <Descriptions.Item label="Zip Code" span={1}>
              {this.props.order.customer_details.shipmentDetails.zipCode}
            </Descriptions.Item>
            <Descriptions.Item label="City" span={1}>
              {this.props.order.customer_details.billingDetails.city}
            </Descriptions.Item>
            <Descriptions.Item label="Country Code" span={1}>
              {this.props.order.customer_details.billingDetails.countryCode}
            </Descriptions.Item>
          </Descriptions>
        </Box>

        <Box>
          <Title level={4}>Order Details</Title>
          <Table
            columns={this.columns}
            dataSource={this.props.tableDataOrderItems}
          />
        </Box>
      </>
    );
  }
}
