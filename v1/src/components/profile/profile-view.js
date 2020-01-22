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
  }
  showProfileEdit = () => {
    this.setState({ profileModal: true });
  };
  handleProfileEdit = () => {
    this.setState({ profileModal: false });
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
                      <Text strong>{this.props.user._id}</Text>
                      <br />
                      <Text>Premium user</Text>
                      <br />
                      <Text>Address</Text>
                    </div>
                  </div>
                  <div>
                    <Button onClick={this.showProfileEdit}>Edit Profile</Button>
                  </div>
                </div>
                <Divider />
              </TabPane>
              <TabPane key="2" tab="Billing">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10
                  }}
                >
                  <Text strong>Payment Method</Text>
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
              <Input style={{ marginTop: 4 }} />
            </Col>
            <Col span={12}>
              <label>Last Name</label>
              <Input style={{ marginTop: 4 }} />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={18}>
              <label>Address</label>
              <Input style={{ marginTop: 4 }} />
            </Col>
            <Col span={6}>
              <label>Postal Code</label>
              <Input style={{ marginTop: 4 }} />
            </Col>
          </Row>
        </Modal>
      </Layout>
    );
  }
}
