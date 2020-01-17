import React from 'react';
import { Box } from '../../styles/style';
import {
  Layout,
  Col,
  Typography,
  Tabs,
  Avatar,
  Descriptions,
  Button,
  Divider
} from 'antd';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
export default class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
                    <Button>Edit Profile</Button>
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
                asdad
              </TabPane>
            </Tabs>
          </Box>
        </Col>
      </Layout>
    );
  }
}
