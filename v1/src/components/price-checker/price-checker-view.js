import React from "react";
import { Box, ModalSwitchItem } from "../../styles/style";
import {
  Button,
  Table,
  Modal,
  Tag,
  Switch,
  Typography,
  Divider,
  InputNumber
} from "antd";
import { getAutoOfferInfo } from "../../utils/bol";
const { Text } = Typography;

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default class PriceCheckerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedOffer: null
    };
    this.columns = [
      {
        title: "Product Name",
        dataIndex: "productName",
        key: "productName"
      },
      {
        title: "Live tracking",
        dataIndex: "liveTracking",
        key: "liveTracking",
        render: value => {
          if (value) return <Tag color="blue">Tracking</Tag>;
        }
      },
      {
        title: "Current Price",
        dataIndex: "currentPrice",
        key: "currentPrice"
      },
      {
        title: "Current Stock",
        dataIndex: "currentStock",
        key: "currentStock"
      },
      {
        title: "Total sellers",
        dataIndex: "totalSellers",
        key: "totalSellers"
      },
      {
        title: "Profit",
        dataIndex: "profit",
        key: "profit"
      },
      {
        title: "Offer Rank",
        dataIndex: "offerRank",
        key: "offerRank"
      },
      {
        title: "Configure",
        key: "configure",
        render: value => (
          <span>
            <a onClick={() => this.handleModal(value)}>Configure</a>
          </span>
        )
      }
    ];
    this.timer = null;

    this.handleModal = this.handleModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeAutoPrice = this.handleChangeAutoPrice.bind(this);
  }
  handleModal = async e => {
    const autoOfferInfo = await getAutoOfferInfo(e.offerInfo.autoOffer._id);
    this.props.onChange("currentOfferId", autoOfferInfo.offer_id);
    this.props.onChange("minProfit", autoOfferInfo.min_profit);
    this.props.onChange("additionalCosts", autoOfferInfo.additional_costs);
    this.props.onChange("priceUpdate", e.currentPrice);
    this.props.onChange("autoPriceChanger", e.auto_track);
    this.props.onChange("stockUpdate", e.currentStock);
    this.props.handleCommission(e.ean, e.currentPrice);
    this.setState({ showModal: true, selectedOffer: e, autoOfferInfo });
  };
  handleOk = () => {
    this.setState({ showModal: false });
    this.props.handleSubmit(this.state.selectedOffer.offerInfo.autoOffer._id);
  };
  handleCancel = () => {
    this.setState({ showModal: false });
  };
  handleChangeAutoPrice = checked => {
    this.props.onChange("autoPriceChanger", checked);
  };
  handleChangeMinProfit = e => {
    this.props.onChange("minProfit", e);
  };
  handleAdditionalCosts = e => {
    this.props.onChange("additionalCosts", e);
  };
  handleUpdateStockChange = e => {
    this.props.onChange("stockUpdate", e);
  };
  handleUpdatePriceChange = e => {
    this.props.onChange("priceUpdate", e);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.handleCommission(
        this.state.selectedOffer.ean,
        this.props.priceUpdate
      );
    }, WAIT_INTERVAL);
  };

  render() {
    return (
      <>
        <Box>
          <Button type="secondary" onClick={this.props.handleReloadOffers}>
            Reload your offers
          </Button>
        </Box>
        <Box>
          <Table dataSource={this.props.tableOffers} columns={this.columns} />
        </Box>
        {this.state.selectedOffer && (
          <Modal
            title="Basic Modal"
            visible={this.state.showModal}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <ModalSwitchItem>
              <Text>Auto Price updater</Text>
              <Switch
                defaultChecked={
                  this.state.autoOfferInfo.auto_track ? true : false
                }
                onChange={this.handleChangeAutoPrice}
              />
            </ModalSwitchItem>
            {this.props.autoPriceChanger && (
              <ModalSwitchItem style={{ marginTop: 15 }}>
                <Text>Minimum profit boundary</Text>
                <InputNumber
                  defaultValue={this.props.minProfit}
                  formatter={value =>
                    `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  onChange={this.handleChangeMinProfit}
                />
              </ModalSwitchItem>
            )}
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Update stock</Text>
              <InputNumber
                defaultValue={this.props.stockUpdate}
                onChange={this.handleUpdateStockChange}
              />
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Update Price</Text>
              <InputNumber
                defaultValue={this.props.priceUpdate}
                formatter={value =>
                  `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                onChange={this.handleUpdatePriceChange}
              />
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Additional costs (Shipping / Packaging)</Text>
              <InputNumber
                defaultValue={this.props.additionalCosts}
                formatter={value =>
                  `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                onChange={this.handleAdditionalCosts}
              />
            </ModalSwitchItem>
            <Divider />
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Bol.com commission incl. BTW</Text>
              <Text>€ {this.props.bolReceivePrice}</Text>
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Additional costs</Text>
              <Text>€ {this.props.additionalCosts}</Text>
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text strong>Total received</Text>
              <Text strong>
                €{" "}
                {Math.round(
                  ((this.props.priceUpdate -
                    this.props.bolReceivePrice -
                    this.props.additionalCosts) *
                    100) /
                    100
                ).toFixed(2)}
              </Text>
            </ModalSwitchItem>
          </Modal>
        )}
      </>
    );
  }
}
