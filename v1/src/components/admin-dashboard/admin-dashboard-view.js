import React from 'react';
import { Statistic, Button, Row, Col, Typography, Input } from 'antd';
import { Box } from '../../styles/style';

const { Title } = Typography;
const { TextArea } = Input;
export default class AdminDashboardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMonitor = async () => {
    this.props.handleMonitor();
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
        {this.props.monitorStatus && (
          <Row gutter={[16, 16]}>
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
          </Row>
        )}
        <Box>
          <Button onClick={this.handleMonitor}>
            {this.props.monitorStatus ? 'Stop Monitor' : 'Start Monitor'}
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
