import React from 'react';
import DashboardView from './dashboard-view';
import { getMessages, deleteMessage } from '../../utils/user';
import { resendEmailVerification } from '../../utils/auth';
import { notification } from 'antd';

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'E-mail succesvol verzonden',
    description:
      'Een e-mail waarin je je account kan bevestigen is succesvol verzonden',
  });
};

export default class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    const data = await getMessages();
    this.setState({ messages: data.messages });
  }
  handleDelete = async (messageId) => {
    deleteMessage(messageId);
  };
  handleResendEmailVerification = async () => {
    const data = await resendEmailVerification();
    if (data) {
      openNotificationWithIcon('success');
    }
  };
  render() {
    return (
      <DashboardView
        {...this.state}
        {...this.props}
        handleDelete={this.handleDelete}
        handleResendEmailVerification={this.handleResendEmailVerification}
      />
    );
  }
}
