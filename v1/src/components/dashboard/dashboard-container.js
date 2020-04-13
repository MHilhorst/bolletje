import React from 'react';
import DashboardView from './dashboard-view';
import { getMessages, deleteMessage } from '../../utils/user';

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
  render() {
    return (
      <DashboardView
        {...this.state}
        {...this.props}
        handleDelete={this.handleDelete}
      />
    );
  }
}
