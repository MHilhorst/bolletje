import React from 'react';
import ProductManagementView from './product-management-view';

export default class ProductManagementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <ProductManagementView />;
  }
}
