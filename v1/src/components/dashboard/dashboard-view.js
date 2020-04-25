import React from 'react';
import { Box } from '../../styles/style';
import { Typography, Comment, Avatar, Button, Layout, Col, Alert } from 'antd';
const { Title, Text } = Typography;

const getFormattedDate = (date) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
};

class DashboardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleBolModal: false,
    };
  }
  handleBolConfirm = () => {
    this.setState({ visibleBolModal: true });
  };
  handleCancel = () => {
    this.setState({ visibleBolModal: false });
  };
  handleDelete = (messageId) => {
    this.props.handleDelete(messageId._id);
  };

  render() {
    return (
      <>
        <Layout>
          <Col
            sm={{ span: 24, offset: 0 }}
            md={{ span: 12, offset: 6 }}
            lg={{ span: 12, offset: 6 }}
            style={{ marginTop: 20 }}
          >
            {!this.props.user.activated && (
              <Alert
                message={
                  <>
                    <span>
                      Verifieer je e-mail adres. Er is een e-mail verstuurd naar
                      {this.props.user.email}.{' '}
                    </span>
                    <span
                      onClick={this.props.handleResendEmailVerification}
                      style={{ cursor: 'pointer' }}
                    >
                      Klik hier om er nog een te versturen
                    </span>
                  </>
                }
                type="info"
                showIcon
                closable
              />
            )}

            <Box>
              <Title level={2}>Welcome</Title>
              <Text>
                Welcome to the dashboard of Snapse.nl. Please head over the
                helpdesk if you have any problems.
              </Text>
            </Box>
            {this.props.messages &&
              this.props.messages.map((message) => {
                return (
                  <Box>
                    <Comment
                      style={{ marginBottom: '-1em' }}
                      author={'Michael Hilhorst'}
                      avatar={
                        <Avatar
                          src="https://media-exp1.licdn.com/dms/image/C4D03AQGUHyYvEAxkbw/profile-displayphoto-shrink_200_200/0?e=1592438400&v=beta&t=VeqL8jfykx7s1Sbv-aqJYnCE4YBHN8U3JAIDxg3ofRU"
                          alt="Michael Hilhorst"
                        />
                      }
                      content={<p>{message.message}</p>}
                      datetime={getFormattedDate(
                        new Date(message.created)
                      ).toString()}
                    />
                    {this.props.user.admin_account && (
                      <Button onClick={() => this.handleDelete(message)}>
                        Delete
                      </Button>
                    )}
                  </Box>
                );
              })}
            {/* <BolConfirmModal
          visible={this.state.visibleBolModal}
          handleCancel={this.handleCancel}
          user={this.props.user}
        />
        <Box>
          {this.props.user.bol_client_secret &&
            this.props.user.bol_client_id && (
              <Button onClick={this.handleBolConfirm}>
                Update Bol.com credentials
              </Button>
            )}
          {!this.props.user.bol_client_secret &&
            !this.props.user.bol_client_id && (
              <Button onClick={this.handleBolConfirm} type="primary">
                Add your credentials
              </Button>
            )}
        </Box>

        <Box>asd</Box> */}
          </Col>
        </Layout>
      </>
    );
  }
}

export default DashboardView;
