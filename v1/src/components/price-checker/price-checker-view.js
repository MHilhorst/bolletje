import React from 'react';
import { Box, ModalSwitchItem } from '../../styles/style';
import { Button, Table, Modal, Switch, Typography, InputNumber } from 'antd';
import OfferItem from './offer-item';

const { Text } = Typography;
export default class PriceCheckerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalInfo: null
    };
    this.columns = [
      {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'EAN',
        dataIndex: 'ean',
        key: 'ean'
      },
      {
        title: 'Current Price',
        dataIndex: 'currentPrice',
        key: 'currentPrice'
      },
      {
        title: 'Current Stock',
        dataIndex: 'currentStock',
        key: 'currentStock'
      },
      {
        title: 'Total sellers',
        dataIndex: 'totalSellers',
        key: 'totalSellers'
      },
      {
        title: 'Profit',
        dataIndex: 'profit',
        key: 'profit'
      },
      {
        title: 'Offer Rank',
        dataIndex: 'offerRank',
        key: 'offerRank'
      },
      {
        title: 'Configure',
        key: 'configure',
        render: value => (
          <span>
            <a onClick={() => this.handleModal(value)}>Configure</a>
          </span>
        )
      }
    ];
    this.handleModal = this.handleModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeAutoPrice = this.handleChangeAutoPrice.bind(this);
    this.handleProfitChange = this.handleProfitChange.bind(this);
  }
  handleModal = e => {
    console.log(e);
    this.setState({ showModal: true, modalInfo: e });
  };
  handleOk = () => {
    this.setState({ showModal: false });
  };
  handleCancel = () => {
    this.setState({ showModal: false });
  };
  handleChangeAutoPrice = checked => {
    this.props.onChange('autoPriceChanger', checked);
  };
  handleProfitChange = e => {
    this.props.onChange('profit', e);
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
          <Table dataSource={this.props.tableOffers} columns={this.columns} />;
        </Box>
        {this.state.modalInfo && (
          <Modal
            title="Basic Modal"
            visible={this.state.showModal}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <ModalSwitchItem>
              <Text>Auto Price updater</Text>
              <Switch defaultChecked onChange={this.handleChangeAutoPrice} />
            </ModalSwitchItem>
            {this.props.autoPriceChanger && (
              <ModalSwitchItem style={{ marginTop: 15 }}>
                <Text>Minimum profit boundary</Text>
                <InputNumber
                  defaultValue={1000}
                  formatter={value =>
                    `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </ModalSwitchItem>
            )}
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Update stock</Text>
              <InputNumber defaultValue={this.state.modalInfo.currentStock} />
            </ModalSwitchItem>
            <ModalSwitchItem style={{ marginTop: 15 }}>
              <Text>Profit without Bol.com commission</Text>
              <InputNumber
                defaultValue={this.props.profit || 0}
                onChange={this.handleProfitChange}
              />
            </ModalSwitchItem>
          </Modal>
        )}
      </>
    );
  }
}
