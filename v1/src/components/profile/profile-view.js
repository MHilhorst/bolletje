import React from 'react';
import { Box } from '../../styles/style';
import {
  Layout,
  Col,
  Typography,
  Tabs,
  Avatar,
  Button,
  Divider,
  Modal,
  Input,
  Row
} from 'antd';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
export default class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileModal: false
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  handleFirstName = e => {
    this.props.onChange('firstName', e.target.value);
  };
  handleLastName = e => {
    this.props.onChange('lastName', e.target.value);
  };
  handleAddress = e => {
    this.props.onChange('address', e.target.value);
  };
  handleZip = e => {
    this.props.onChange('zip', e.target.value);
  };
  showProfileEdit = () => {
    this.setState({ profileModal: true });
  };
  handleProfileEdit = () => {
    this.setState({ profileModal: false });
    this.props.handleSubmitProfileEdit();
  };
  handleCancel = () => {
    this.setState({ profileModal: false });
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
          <Title level={4}>Account</Title>
          <Box>
            <Tabs defaultActiveKey="1">
              <TabPane key="1" tab="Profile">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={64} icon="user" />
                    <div style={{ marginLeft: 10 }}>
                      <Text strong>
                        {this.props.user.first_name} {this.props.user.last_name}
                      </Text>
                      <br />
                      <Text>Premium user</Text>
                      <br />
                      <Text>
                        {this.props.user.address} {this.props.user.zip}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Button onClick={this.showProfileEdit}>Edit Profile</Button>
                  </div>
                </div>
                <Divider />
                <div>
                  <Text>Premium History</Text>
                </div>
              </TabPane>
              <TabPane key="2" tab="Billing">
                <div>
                  <Text strong>Payment Method</Text>
                  {!this.props.user.premium && <div>asdsad</div>}
                </div>
              </TabPane>
              <TabPane key="3" tab="Security">
                <Text strong>Password</Text>
              </TabPane>
            </Tabs>
          </Box>
        </Col>
        <Modal
          title="Edit Profile Information"
          visible={this.state.profileModal}
          onOk={this.handleProfileEdit}
          onCancel={this.handleCancel}
        >
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={12}>
              <label>First Name</label>
              <Input
                style={{ marginTop: 4 }}
                onChange={this.handleFirstName}
                defaultValue={this.props.user.first_name}
              />
            </Col>
            <Col span={12}>
              <label>Last Name</label>
              <Input
                style={{ marginTop: 4 }}
                onChange={this.handleLastName}
                defaultValue={this.props.user.last_name}
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={18}>
              <label>Address</label>
              <Input
                style={{ marginTop: 4 }}
                onChange={this.handleAddress}
                defaultValue={this.props.user.address}
              />
            </Col>
            <Col span={6}>
              <label>Postal Code</label>
              <Input
                style={{ marginTop: 4 }}
                onChange={this.handleZip}
                defaultValue={this.props.user.zip}
              />
            </Col>
          </Row>
        </Modal>
      </Layout>
    );
  }
}
