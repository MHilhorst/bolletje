import React from 'react';
import { Box, LabelInput } from '../../styles/style';
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
  Row,
} from 'antd';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
export default class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileModal: false,
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  handleFirstName = (e) => {
    this.props.onChange('firstName', e.target.value);
  };
  handleLastName = (e) => {
    this.props.onChange('lastName', e.target.value);
  };
  handleAddress = (e) => {
    this.props.onChange('address', e.target.value);
  };
  handleZip = (e) => {
    this.props.onChange('zip', e.target.value);
  };
  handleEmail = (e) => {
    this.props.onChange('email', e.target.value);
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
  handleOldPass = (e) => {
    this.props.onChange('oldPass', e.target.value);
  };
  handleNewPass = (e) => {
    this.props.onChange('newPass', e.target.value);
  };
  handleNewVerifyPass = (e) => {
    this.props.onChange('newVerifyPass', e.target.value);
  };
  handleUpgrade = (e) => {
    this.props.handleUpgrade();
  };
  handleIdChange = (e) => {
    this.props.onChange('bolClientId', e.target.value);
  };
  handleSecretChange = (e) => {
    this.props.onChange('bolClientSecret', e.target.value);
  };
  handleBolShopName = (e) => {
    this.props.onChange('bolShopName', e.target.value);
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
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar size={64} icon="user" />
                      <div style={{ marginLeft: 10 }}>
                        <Text strong>
                          {this.props.user.first_name}{' '}
                          {this.props.user.last_name}
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
                      <Button onClick={this.showProfileEdit}>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  <Divider />
                  <Title level={4}>Bol.com Credentials</Title> <br />
                  <LabelInput>Bol.com Shop Name</LabelInput>
                  <Input
                    style={{ marginTop: 12, marginBottom: 12 }}
                    onChange={this.handleBolShopName}
                    value={
                      this.props.bolShopName || this.props.user.bol_shop_name
                    }
                  />
                  <LabelInput>Bol.com Client ID</LabelInput>
                  <Input
                    style={{ marginTop: 12, marginBottom: 12 }}
                    onChange={this.handleIdChange}
                    value={
                      this.props.bolClientId || this.props.user.bol_client_id
                    }
                  />
                  <LabelInput>Bol.com Client Secret</LabelInput>
                  <br />
                  <Input
                    style={{ marginTop: 12, marginBottom: 12 }}
                    onChange={this.handleSecretChange}
                    value={this.props.bolClientSecret}
                    disabled={this.props.user.bol_client_id ? true : false}
                  />
                  <Button onClick={this.props.handleBolUpdate}>Save</Button>
                </div>
              </TabPane>
              <TabPane key="2" tab="Billing" disabled>
                <div>
                  <Text strong style={{ fontSize: 16, color: '#999' }}>
                    Current Package{' '}
                  </Text>
                  <br />
                  <Text strong style={{ fontSize: 20 }}>
                    Free
                  </Text>
                </div>
                <Divider />
                <Button onClick={() => this.handleUpgrade()}>Upgrade</Button>
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
          <div style={{ marginBottom: 10 }}>
            <Text strong style={{ fontSize: 18 }}>
              Account Information
            </Text>
          </div>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={24}>
              <label>E-mail</label>
              <Input
                style={{ marginTop: 4 }}
                onChange={this.handleEmail}
                defaultValue={this.props.user.email}
                disabled
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={24}>
              <label>Old Password</label>
              <Input style={{ marginTop: 4 }} onChange={this.handleOldPass} />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={24}>
              <label>New Password</label>
              <Input style={{ marginTop: 4 }} onChange={this.handleNewPass} />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={24}>
              <label>Retype New Password</label>
              <Input
                style={{ marginTop: 4 }}
                onChange={this.handleNewVerifyPass}
              />
            </Col>
          </Row>
          <Divider />
          <div style={{ marginBottom: 10 }}>
            <Text strong style={{ fontSize: 18 }}>
              Personal Information
            </Text>
          </div>

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
