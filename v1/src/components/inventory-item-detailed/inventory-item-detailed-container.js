import React from 'react';
import InventoryItemDetailedView from './inventory-item-detailed-view';
import { checkInventoryItem } from '../../utils/auth';
import { Redirect } from 'react-router-dom';
import {
  setProductNameOfInventoryItem,
  setStockOfInventoryItem
} from '../../utils/inventory';
export default class InventoryItemDetailedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      editStock: false
    };
  }
  async componentDidMount() {
    const id = this.props.location.pathname.split('/')[2];
    const inventoryItem = await checkInventoryItem(id);
    this.setState({ inventoryItem, loading: false });
  }
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  handleUpdateStock = async () => {
    const data = await setStockOfInventoryItem(
      this.state.inventoryItem._id,
      this.state.stock
    );
    this.setState({ inventoryItem: data.inventoryItem, editStock: false });
    window.location.reload();
  };

  handleUpdateProductName = async () => {
    const data = await setProductNameOfInventoryItem(
      this.state.inventoryItem._id,
      this.state.productName
    );
    this.setState({
      inventoryItem: data.inventoryItem,
      editProductName: false
    });
  };
  render() {
    if (this.state.inventoryItem && !this.state.loading) {
      return (
        <InventoryItemDetailedView
          {...this.props}
          {...this.state}
          onChange={this.onChange}
          handleUpdateStock={this.handleUpdateStock}
          handleUpdateProductName={this.handleUpdateProductName}
        />
      );
    }
    if (!this.state.offer && !this.state.loading) {
      return <Redirect to="/dashboard" />;
    } else {
      return null;
    }
  }
}
