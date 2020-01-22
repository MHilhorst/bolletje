import React from 'react';
import PluginAliExpressView from './plugin-aliexpress-view';
import { getPluginAliExpressOffers } from '../../utils/plugins/aliexpress';

export default class PluginAliExpressContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    const data = await getPluginAliExpressOffers();
    const tableData = [];
    data.products.map(product => {
      const tableEntry = {
        productImage: product.imageUrl,
        productName: product.name,
        productPrice: product.price
      };
      tableData.push(tableEntry);
    });
    this.setState({ products: data.products, tableData });
  }
  render() {
    if (this.state.products && this.state.tableData) {
      return <PluginAliExpressView {...this.state} />;
    } else {
      return null;
    }
  }
}
