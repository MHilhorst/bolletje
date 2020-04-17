import React from 'react';
import AdminDashboardView from './admin-dashboard-view';
import {
  startMonitor,
  getStatusMonitor,
  stopMonitor,
  setBroadcast,
  startMonitorRepricer,
  stopMonitorRepricer,
  getStatusMonitorRepricer,
} from '../../utils/admin';

export default class AdminDashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleMonitor = async () => {
    if (this.state.running) {
      await stopMonitor();
    } else {
      await startMonitor();
    }
  };
  handleMonitorRepricer = async () => {
    if (this.state.running) {
      await stopMonitorRepricer();
    } else {
      await startMonitorRepricer();
    }
  };
  async componentDidMount() {
    const data = await getStatusMonitor();
    const dataRepricer = await getStatusMonitorRepricer();
    console.log(data);
    this.setState({
      monitorStatus: data.status,
      monitorNextRun: data.next_run,
      monitorStartTime: data.start_tracking_time,
      monitorAPICalls: data.monitor_api_calls,
      monitorStatusRepricer: dataRepricer.status,
    });
    if (data.hasOwnProperty('status') && data.status) {
      this.setState({ running: true });
    } else {
      this.setState({ running: false });
    }
  }

  handleBroadcast = async () => {
    await setBroadcast(this.state.broadcastTitle, this.state.broadcastText);
  };
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  render() {
    return (
      <AdminDashboardView
        handleMonitor={this.handleMonitor}
        handleMonitorRepricer={this.handleMonitorRepricer}
        {...this.state}
        onChange={this.onChange}
        handleBroadcast={this.handleBroadcast}
      />
    );
  }
}
