import React from 'react';
import CreateInventoryItemView from './create-inventory-item-view';
import { setNewInventoryItem } from '../../utils/inventory';
export default class CreateInventoryItemContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };
  submit = async () => {
    const data = {
      productName: this.state.productName,
      stock: this.state.stock,
      platforms: this.state.platformAvailable
    };
    setNewInventoryItem(data);
  };
  render() {
    return (
      <CreateInventoryItemView onChange={this.onChange} submit={this.submit} />
    );
  }
}
