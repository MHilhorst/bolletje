import React from 'react';
import InventoryOverviewView from './inventory-overview-view';

import { getUserInventoryItems } from '../../utils/inventory';

export default class InventoryOverviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      loadingOffers: false,
      tableOffers: []
    };
  }
  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  async componentDidMount() {
    const offerTableSchema = [];
    const inventoryItems = await getUserInventoryItems();
    inventoryItems.items.map(item => {
      offerTableSchema.push({
        productName: item.product_name,
        inventoryItemId: item._id,
        currentStock: item.stock,
        info: item,
        platformAvailable: item.platform_available
      });
    });
    this.setState({
      tableOffers: offerTableSchema,
      loadingOffers: false
    });
  }

  refreshInventoryItems = async () => {
    const inventoryItems = await getUserInventoryItems();
    const offerTableSchema = [];
    inventoryItems.items.map(item => {
      offerTableSchema.push({
        productName: item.product_name,
        inventoryItemId: item._id,
        info: item,
        currentStock: item.stock,
        platformAvailable: item.platform_available
      });
    });
    console.log(offerTableSchema);

    this.setState({
      tableOffers: offerTableSchema
    });
  };

  render() {
    if (this.state.tableOffers) {
      return (
        <InventoryOverviewView
          handleReloadOffers={this.handleReloadOffers}
          onChange={this.onChange}
          {...this.state}
          {...this.props}
          refreshInventoryItems={this.refreshInventoryItems}
        />
      );
    } else return null;
  }
}
