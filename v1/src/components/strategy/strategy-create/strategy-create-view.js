import React from 'react';
import {
  Modal,
  Button,
  Steps,
  Radio,
  Card,
  Typography,
  Alert,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Divider,
} from 'antd';
import {
  StrategyCreateBox,
  StrategyRadioOption,
  LabelInput,
  LabelDescription,
} from '../../../styles/style';
import { ShopOutlined, EuroOutlined, TagOutlined } from '@ant-design/icons';
import { createRepricerStrategy } from '../../../utils/repricer';
const { Step } = Steps;
const { Text } = Typography;
const { Option } = Select;

export default class StrategyCreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      strategyType: 'targetBuyBox',
      strategyModalForwardButtonText: 'Next',
      strategyModalBackButtonText: 'Cancel',
      firstClick: true,
      boundaryPriceType: 'ROI',
      loadingHandleCreateStrategy: false,
      priceLogic: 'priceBelow',
      buyBoxOperator: 'plus',
      buyBoxPriceNumber: '€',
      buyBoxPrice: 'currentPrice',
      priceAgainstOperator: '€',
      competeAgainstBol: false,
      boundaryPriceNumber: 10,
    };
    this.steps = [
      {
        title: 'Strategy Type',
      },
      {
        title: 'Competition Environment',
      },
      {
        title: 'Minimum Pricing',
      },
    ];
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleCancel = () => {
    this.setState({ strategyModal: false });
  };
  strategyOnChange = (e) => {
    this.setState({ strategyType: e.target.value });
  };

  handleStrategyName = (e) => {
    this.setState({ strategyName: e.target.value });
  };

  handleDatafeedURL = (e) => {
    this.setState({ datafeedURL: e.target.value });
  };
  handleSelectPriceAgainstOperator = (e) => {
    this.setState({ priceAgainstOperator: e });
    console.log(this.state.priceAgainstOperator);
  };

  handlePriceCompetition = (e) => {
    this.setState({ priceAgainstCompetitor: e });
  };

  handleCompeteBol = (e) => {
    this.setState({
      competeAgainstBol: e.target.value === 'true' ? true : false,
    });
  };

  handleSupressedBuyBoxOperator = (e) => {
    this.setState({ supressedBuyBoxOperator: e });
  };
  handleSupressBuyBoxNumber = (e) => {
    this.setState({ supressedBuyBoxNumber: e });
  };
  handleSelectTypeSupressedBuyBox = (e) => {
    this.setState({ supressedBuyBoxType: e });
  };
  handleGotBuyBoxPriceType = (e) => {
    if (e === 'currentPrice') {
      this.setState({ buyBoxPrice: e, buyBoxNumber: null });
    } else {
      this.setState({ buyBoxPrice: e });
    }
  };
  handleGotBuyBoxPriceOperator = (e) => {
    this.setState({ buyBoxOperator: e });
  };
  handleGotBuyBoxPriceNumber = (e) => {
    this.setState({ buyBoxNumber: e });
  };
  handleGotBuyBoxPriceNumberType = (e) => {
    this.setState({ buyBoxPriceNumber: e });
  };
  boundaryPriceChange = (e) => {
    this.setState({
      boundaryPriceType: e.target.value,
    });
  };
  handleboundaryPriceNumber = (e) => {
    this.setState({
      boundaryPriceNumber: e,
    });
  };

  handleSelectPriceLogic = (e) => {
    if (e === 'matchPrice') {
      this.setState({ priceLogic: e, price_increment: null });
    } else {
      this.setState({ priceLogic: e });
    }
  };

  handleCreateStrategy = async () => {
    this.setState({ loadingHandleCreateStrategy: true });
    const data = await createRepricerStrategy({
      strategy_name: this.state.strategyName,
      datafeed_url: this.state.datafeedURL,
      strategy_type: this.state.strategyType,
      price_increment:
        this.state.priceLogic !== 'matchPrice'
          ? this.state.priceAgainstCompetitor
          : null,
      price_increment_type:
        this.state.priceLogic !== 'matchPrice'
          ? this.state.priceAgainstOperator
          : null,
      increment_type: this.state.priceLogic,
      compete_with_bol: this.state.competeAgainstBol,
      'buy_box_price_action.increment_type': this.state.buyBoxPrice,
      'buy_box_price_action.pricing_increment_type':
        this.state.buyBoxPrice !== 'currentPrice'
          ? this.state.buyBoxPriceNumber
          : null,
      'buy_box_price_action.pricing_increment':
        this.state.buyBoxPrice !== 'currentPrice'
          ? this.state.buyBoxNumber
          : null,
      'buy_box_price_action.increment_operator':
        this.state.buyBoxPrice !== 'currentPrice'
          ? this.state.buyBoxOperator
          : null,
      'minimum_pricing.percentage': this.state.boundaryPriceNumber,
      'minimum_pricing.pricing_type': this.state.boundaryPriceType,
    });
    if (data.success) {
      this.setState({ loadingHandleCreateStrategy: false });
      window.location.reload();
    }
  };

  render() {
    const { current } = this.state;
    return (
      <>
        <Button onClick={() => this.setState({ strategyModal: true })}>
          Create Strategy
        </Button>
        <Modal
          title={
            'Strategy Builder | ' +
            (this.state.strategyName ? this.state.strategyName : '')
          }
          visible={this.state.strategyModal}
          onCancel={this.handleCancel}
          okText={this.state.strategyModalForwardButtonText}
          width={900}
          footer={0}
        >
          <Steps current={this.state.current} progressDot>
            <Step key={'Strategy Type'} title={'Strategy Type'} />
            <Step
              key={
                this.state.strategyType !== 'datafeed'
                  ? 'Competition Environment'
                  : 'Field mapping'
              }
              title={
                this.state.strategyType !== 'datafeed'
                  ? 'Competition Environment'
                  : 'Field mapping'
              }
            />
            <Step
              key={'Minimum Pricing'}
              title={
                this.state.strategyType !== 'datafeed'
                  ? 'Minimum pricing configuration'
                  : 'Datafeed upload'
              }
            />
          </Steps>
          {this.state.current === 0 && (
            <StrategyCreateBox>
              <Typography.Title
                level={4}
                style={{ paddingBottom: 0, marginBottom: 0 }}
              >
                Set a strategy name
              </Typography.Title>
              <LabelDescription>
                Make sure the URL is public available. Paste the whole URL
              </LabelDescription>
              <br />
              <Input
                style={{ marginTop: 4, width: 400 }}
                onChange={this.handleStrategyName}
                value={this.state.strategyName}
              />
              <Typography.Title
                level={4}
                style={{ paddingBottom: 0, marginBottom: 0, marginTop: 12 }}
              >
                Choose a strategy type
              </Typography.Title>
              <Radio.Group
                onChange={this.strategyOnChange}
                value={this.state.strategyType}
              >
                <Radio value="targetBuyBox">
                  <StrategyRadioOption>
                    <Card
                      title="Pre-Configured"
                      style={{
                        width: 180,
                        borderRadius: 5,
                        border:
                          this.state.strategyType === 'targetBuyBox'
                            ? '1px solid #0069ff'
                            : '1px solid #e8e8e8',
                      }}
                      size="small"
                      headStyle={{
                        paddingBottom: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        backgroundColor: '#f1f1f1',
                        borderBottom: 'none',
                        fontSize: '0.8rem',
                      }}
                    >
                      <ShopOutlined
                        style={{
                          fontSize: 40,
                          color: '#0069ff',
                          marginTop: 12,
                        }}
                      />
                      <h4 style={{ fontWeight: 500, marginTop: 4 }}>
                        Target Buy Box
                      </h4>
                      <Text>
                        Compete directly with {<br />}the Buy Box directly.
                      </Text>
                    </Card>
                  </StrategyRadioOption>
                </Radio>
                <Radio value="lowestPrice">
                  <StrategyRadioOption>
                    <Card
                      title="Pre-Configured"
                      style={{
                        width: 180,
                        borderRadius: 5,
                        border:
                          this.state.strategyType === 'lowestPrice'
                            ? '1px solid #0069ff'
                            : '1px solid #e8e8e8',
                      }}
                      size="small"
                      headStyle={{
                        paddingBottom: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        backgroundColor: '#f1f1f1',
                        borderBottom: 'none',
                        fontSize: '0.8rem',
                      }}
                    >
                      <ShopOutlined
                        style={{
                          fontSize: 40,
                          color: '#0069ff',
                          marginTop: 12,
                        }}
                      />
                      <h4 style={{ fontWeight: 500, marginTop: 4 }}>
                        Lowest Price Offer
                      </h4>
                      <Text>Compete with {<br />}the lowest price offer.</Text>
                    </Card>
                  </StrategyRadioOption>
                </Radio>
                <Radio value="datafeed">
                  <StrategyRadioOption>
                    <Card
                      title="Manual"
                      style={{
                        width: 180,
                        borderRadius: 5,
                        border:
                          this.state.strategyType === 'datafeed'
                            ? '1px solid #0069ff'
                            : '1px solid #e8e8e8',
                      }}
                      size="small"
                      headStyle={{
                        paddingBottom: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        backgroundColor: '#f1f1f1',
                        borderBottom: 'none',
                        fontSize: '0.8rem',
                      }}
                    >
                      <ShopOutlined
                        style={{
                          fontSize: 40,
                          color: '#0069ff',
                          marginTop: 12,
                        }}
                      />
                      <h4 style={{ fontWeight: 500, marginTop: 4 }}>
                        CSV Data Feed
                      </h4>
                      <Text>Upload your {<br />}own datafeed.</Text>
                    </Card>
                  </StrategyRadioOption>
                </Radio>
              </Radio.Group>
              {this.state.strategyType === 'lowestPrice' && (
                <Alert
                  message="About the Lowest Price Offer strategy"
                  description="Additional description and information about copywriting."
                  type="info"
                  showIcon
                />
              )}
              {this.state.strategyType === 'targetBuyBox' && (
                <Alert
                  message="About the Target Buy Box strategy"
                  description="Additional description and information about copywriting."
                  type="info"
                  showIcon
                />
              )}
            </StrategyCreateBox>
          )}
          {this.state.current === 1 && this.state.strategyType === 'datafeed' && (
            <StrategyCreateBox>
              <>
                <Typography.Title
                  level={4}
                  style={{ paddingBottom: 0, marginBottom: 0 }}
                >
                  Datafeed URL
                </Typography.Title>
                <LabelDescription>
                  Make sure the URL is public available. Paste the whole URL
                </LabelDescription>
                <br />
                <Input
                  style={{ marginTop: 4, width: 400 }}
                  onChange={this.handleDatafeedURL}
                  value={this.state.datafeedURL}
                />
              </>
            </StrategyCreateBox>
          )}
          {this.state.current === 1 && this.state.strategyType !== 'datafeed' && (
            <StrategyCreateBox>
              <Row gutter={16}>
                <Col span={10}>
                  <Alert
                    message="About the Target Buy Box strategy"
                    description="Additional description and information about copywriting."
                    type="info"
                    showIcon
                  />
                </Col>
                <Col span={14}>
                  <LabelInput>How to price against the competition</LabelInput>
                  <br />
                  <LabelDescription>
                    Make sure the URL is public available. Paste the whole URL
                  </LabelDescription>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Select
                      defaultValue="priceBelow"
                      style={{ width: 120, marginTop: 4 }}
                      onChange={this.handleSelectPriceLogic}
                    >
                      <Option value="priceBelow">Price Below</Option>
                      <Option value="matchPrice">Match Price</Option>
                    </Select>
                    {this.state.priceLogic === 'priceBelow' && (
                      <>
                        <span style={{ paddingLeft: 6, paddingRight: 6 }}>
                          By
                        </span>
                        <InputNumber
                          style={{ marginTop: 4, width: 120 }}
                          onChange={this.handlePriceCompetition}
                        />
                        <Select
                          defaultValue="€"
                          style={{ marginLeft: 6, width: 50, marginTop: 4 }}
                          onChange={this.handleSelectPriceAgainstOperator}
                        >
                          <Option value="€">€</Option>
                          <Option value="%">%</Option>
                        </Select>
                      </>
                    )}
                  </div>
                  <LabelInput>Compete against Bol.com?</LabelInput>
                  <br />
                  <LabelDescription>
                    Do you want to compete against Bol.com if they are one of
                    the sellers.
                  </LabelDescription>
                  <Radio.Group
                    defaultValue="false"
                    style={{ marginTop: 4, marginBottom: 16 }}
                    onChange={this.handleCompeteBol}
                  >
                    <Radio.Button value="false">No</Radio.Button>
                    <Radio.Button value="true">Yes</Radio.Button>
                  </Radio.Group>
                  <br />
                  <LabelInput>Supressed Buy Box</LabelInput>
                  <br />
                  <LabelDescription>
                    What to do when there are no other competitors
                  </LabelDescription>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    Set to
                    <Select
                      defaultValue="currentPrice"
                      style={{ width: 120, marginTop: 4, marginLeft: 6 }}
                    >
                      <Option value="currentPrice">Current Price</Option>
                    </Select>
                    <Select
                      defaultValue="plus"
                      style={{ width: 50, marginTop: 4, marginLeft: 6 }}
                      onChange={this.handleSupressedBuyBoxOperator}
                    >
                      <Option value="minus">-</Option>
                      <Option value="plus">+</Option>
                    </Select>
                    <InputNumber
                      style={{ marginTop: 4, width: 120, marginLeft: 6 }}
                      onChange={this.handleSupressBuyBoxNumber}
                    />
                    <Select
                      defaultValue="€"
                      style={{ marginLeft: 6, width: 50, marginTop: 4 }}
                      onChange={this.handleSelectTypeSupressedBuyBox}
                    >
                      <Option value="€">€</Option>
                      <Option value="%">%</Option>
                    </Select>
                  </div>
                  <Divider />
                  <LabelInput>Pricing when required the Buy Box</LabelInput>
                  <br />
                  <LabelDescription>
                    What to do when you got the Buy Box
                  </LabelDescription>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    Set to
                    <Select
                      defaultValue="currentPrice"
                      style={{ width: 120, marginTop: 4, marginLeft: 6 }}
                      onChange={this.handleGotBuyBoxPriceType}
                    >
                      <Option value="currentPrice">Current Price</Option>
                      <Option value="modifyPrice">Modify Price</Option>
                    </Select>
                    {this.state.buyBoxPrice === 'modifyPrice' && (
                      <>
                        <Select
                          defaultValue="plus"
                          style={{ width: 50, marginTop: 4, marginLeft: 6 }}
                          onChange={this.handleGotBuyBoxPriceOperator}
                        >
                          <Option value="minus">-</Option>
                          <Option value="plus">+</Option>
                        </Select>
                        <InputNumber
                          style={{ marginTop: 4, width: 120, marginLeft: 6 }}
                          onChange={this.handleGotBuyBoxPriceNumber}
                        />
                        <Select
                          defaultValue="€"
                          style={{ marginLeft: 6, width: 50, marginTop: 4 }}
                          onChange={this.handleGotBuyBoxPriceNumberType}
                        >
                          <Option value="€">€</Option>
                          <Option value="%">%</Option>
                        </Select>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </StrategyCreateBox>
          )}
          {this.state.current === 2 && this.state.strategyType !== 'datafeed' && (
            <StrategyCreateBox>
              <Typography.Title
                level={4}
                style={{ paddingBottom: 0, marginBottom: 0 }}
              >
                Set a minimum listing price
              </Typography.Title>
              <Radio.Group
                onChange={this.boundaryPriceChange}
                value={this.state.boundaryPriceType}
                defaultValue={this.state.boundaryPriceType}
              >
                <Radio value="ROI">
                  <StrategyRadioOption>
                    <Card
                      title="Automatic"
                      style={{
                        width: 180,
                        borderRadius: 5,
                        border:
                          this.state.boundaryPriceType === 'ROI'
                            ? '1px solid #0069ff'
                            : '1px solid #e8e8e8',
                      }}
                      size="small"
                      headStyle={{
                        paddingBottom: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        backgroundColor: '#f1f1f1',
                        borderBottom: 'none',
                        fontSize: '0.8rem',
                      }}
                    >
                      <EuroOutlined
                        style={{
                          fontSize: 40,
                          color: '#0069ff',
                          marginTop: 12,
                        }}
                      />
                      <h4 style={{ fontWeight: 500, marginTop: 4 }}>ROI</h4>
                      <Text>
                        Calculated based on {<br />} return on investment.
                      </Text>
                    </Card>
                  </StrategyRadioOption>
                </Radio>

                <Radio value="FixedPrice">
                  <StrategyRadioOption>
                    <Card
                      title="Automatic"
                      style={{
                        width: 180,
                        borderRadius: 5,
                        border:
                          this.state.boundaryPriceType === 'FixedPrice'
                            ? '1px solid #0069ff'
                            : '1px solid #e8e8e8',
                      }}
                      size="small"
                      headStyle={{
                        paddingBottom: 0,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        backgroundColor: '#f1f1f1',
                        borderBottom: 'none',
                        fontSize: '0.8rem',
                      }}
                    >
                      <TagOutlined
                        style={{
                          fontSize: 40,
                          color: '#0069ff',
                          marginTop: 12,
                        }}
                      />
                      <h4 style={{ fontWeight: 500, marginTop: 4 }}>
                        Fixed Price
                      </h4>
                      <Text>
                        Calculated based on {<br />} return on investment.
                      </Text>
                    </Card>
                  </StrategyRadioOption>
                </Radio>
              </Radio.Group>
              <br />
              <LabelInput>Minimum ROI percentage profit</LabelInput>
              <br />
              <LabelDescription>Fill in percentage</LabelDescription>
              <br />
              <InputNumber
                style={{ marginTop: 4, width: 120 }}
                min={0}
                max={100}
                defaultValue={this.state.boundaryPriceNumber}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace('%', '')}
                onChange={this.handleboundaryPriceNumber}
              />
            </StrategyCreateBox>
          )}
          <div
            className="ant-modal-footer"
            style={{
              border: 0,
              paddingRight: 0,
              marginRight: 0,
              paddingBottom: 0,
            }}
          >
            {current > 0 && (
              <Button style={{ margin: '0 4px' }} onClick={() => this.prev()}>
                Previous
              </Button>
            )}
            {current < this.steps.length - 1 && (
              <Button
                type="primary"
                disabled={
                  this.state.strategyType &&
                  this.state.strategyName &&
                  current === 0
                    ? false
                    : this.state.priceAgainstCompetitor ||
                      this.state.priceLogic === 'matchPrice'
                    ? false
                    : this.state.buyBoxPrice === 'modifyPrice' ||
                      this.state.buyBoxNumber
                    ? false
                    : this.state.datafeedURL
                    ? false
                    : true
                }
                onClick={() => this.next()}
              >
                Next
              </Button>
            )}
            {current === this.steps.length - 1 && (
              <Button
                type="primary"
                disabled={this.state.strategyType ? false : true}
                onClick={this.handleCreateStrategy}
                loading={this.state.loadingHandleCreateStrategy}
              >
                Done
              </Button>
            )}
          </div>
        </Modal>
      </>
    );
  }
}
