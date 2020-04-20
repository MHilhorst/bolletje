import React from 'react';
import { Statistic, Button, Row, Col, Typography, Input } from 'antd';
import { Box } from '../../styles/style';

const { Title } = Typography;
const { TextArea } = Input;

const getFormattedDate = (date) => {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return (
    dd +
    '-' +
    mm +
    '-' +
    yyyy +
    ' ' +
    hours +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes)
  );
};

export default class AdminDashboardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMonitor = async () => {
    this.props.handleMonitor();
  };

  handleMonitorRepricer = async () => {
    this.props.handleMonitorRepricer();
  };

  handleBroadcast = async () => {
    this.props.handleBroadcast();
  };
  handleTextChange = (e) => {
    this.props.onChange('broadcastText', e.target.value);
  };
  handleTitleChange = (e) => {
    this.props.onChange('broadcastTitle', e.target.value);
  };
  render() {
    return (
      <>
        <Row gutter={[16, 16]}>
          {this.props.monitorStatus && (
            <Col span={4}>
              <Box>
                <Statistic
                  title="Monitor"
                  value={this.props.monitorStatus ? 'Running' : 'Offline'}
                  valueStyle={
                    this.props.monitorStatus ? { color: '#3f8600' } : null
                  }
                />
              </Box>
            </Col>
          )}
          {this.props.monitorStatus && (
            <Col span={4}>
              <Box>
                <Statistic
                  title="Next Update"
                  value={
                    this.props.monitorNextRun
                      .replace(/T/, ' ') // replace T with a space
                      .replace(/\..+/, '') // delete the dot and everything after
                  }
                />
              </Box>
            </Col>
          )}{' '}
          {this.props.monitorStatus && (
            <Col span={4}>
              <Box>
                <Statistic
                  title="Monitor Running Since"
                  value={
                    getFormattedDate(new Date(this.props.monitorStartTime))
                    // .replace(/T/, ' ') // replace T with a space
                    // .replace(/\..+/, '') // delete the dot and everything after}
                  }
                />
              </Box>
            </Col>
          )}{' '}
          {this.props.monitorStatus && (
            <Col span={4}>
              <Box>
                <Statistic
                  title="API CALLS"
                  value={
                    this.props.monitorAPICalls
                    // .replace(/T/, ' ') // replace T with a space
                    // .replace(/\..+/, '') // delete the dot and everything after}
                  }
                />
              </Box>
            </Col>
          )}{' '}
          {this.props.monitorStatus && (
            <Col span={4}>
              <Box>
                <Statistic
                  title="Average Calls / Hour"
                  value={
                    this.props.monitorAPICalls /
                    (((new Date().getTime() -
                      new Date(this.props.monitorStartTime).getTime()) /
                      1000) *
                      60 *
                      60)
                    // .replace(/T/, ' ') // replace T with a space
                    // .replace(/\..+/, '') // delete the dot and everything after}
                  }
                />
              </Box>
            </Col>
          )}
          <Col span={4}>
            <Box>
              <Statistic
                title="Repricer Monitor Status"
                value={this.props.monitorStatusRepricer ? 'Running' : 'Offline'}
                valueStyle={
                  this.props.monitorStatusRepricer ? { color: '#3f8600' } : null
                }
              />
            </Box>
          </Col>
        </Row>

        <Box>
          <Button onClick={this.handleMonitor}>
            {this.props.monitorStatus ? 'Stop Monitor' : 'Start Monitor'}
          </Button>
          <Button onClick={this.handleMonitorRepricer}>
            {this.props.monitorStatusRepricer
              ? 'Stop Repricer Monitor'
              : 'Start Repricer Monitor'}
          </Button>
        </Box>
        <Box>
          <Title level={4}>Nieuw Persbericht</Title>
          <Input addonBefore="Titel" onChange={this.handleTitleChange} />
          <TextArea
            rows={4}
            style={{ marginTop: 12, marginBottom: 12 }}
            onChange={this.handleTextChange}
          />
          <Button onClick={this.handleBroadcast}>Submit</Button>
        </Box>
      </>
    );
  }
}
