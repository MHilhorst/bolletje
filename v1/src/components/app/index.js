import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RouteWrapper from './route-wrapper';
import LoginWrapper from './login-wrapper';
import Dashboard from '../dashboard';
import InventoryOverview from '../inventory-overview';
import Orders from '../orders';
import InventoryItemDetailed from '../inventory-item-detailed';
import BaseLayout from '../../layouts/base-layout';
import OrderDetailed from '../order-detailed';
import PluginAliExpress from '../plugin-aliexpress';
import Login from '../login';
import CreateInventoryItem from '../create-inventory-item';
import Loading from '../loading';
import PriceChecker from '../price-checker';
import Profile from '../profile';
import ProductManagement from '../product-management';
import ProductSoldAnalytics from '../product-sold-analytics';
import ProductSoldAnalyticsDetailed from '../product-sold-analytics-detailed';
import Cookies from 'js-cookie';
import config from '../../config';
import SearchAnalytics from '../search-analytics';
import CreateOffer from '../create-offer';
const jwt = Cookies.get('token');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      loading: true
    };
  }
  componentDidMount() {
    fetch(`${config.host}/api/user`, {
      method: 'GET',
      headers: {
        Authorization: jwt
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ user: data.user, loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }
  render() {
    if (!this.state.loading) {
      return (
        <Router>
          <Switch>
            <RouteWrapper
              exact
              path="/dashboard"
              component={Dashboard}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/search-analytics"
              component={SearchAnalytics}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/create-offer"
              component={CreateOffer}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/product-sold-analytics"
              component={ProductSoldAnalytics}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              path="/product-sold-analytics/:id"
              component={ProductSoldAnalyticsDetailed}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              path="/product-management/:id"
              component={ProductManagement}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />{' '}
            <RouteWrapper
              exact
              path="/inventory-overview"
              component={InventoryOverview}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/inventory/:id"
              component={InventoryItemDetailed}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/inventory-overview/create"
              component={CreateInventoryItem}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/price-checker"
              component={PriceChecker}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/orders"
              component={Orders}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/order/:id"
              component={OrderDetailed}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/plugin/aliexpress"
              component={PluginAliExpress}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/profile"
              component={Profile}
              layout={BaseLayout}
              user={this.state.user}
              {...this.props}
            />
            <Route
              exact
              path="/login"
              component={Login}
              user={this.state.user}
            />
          </Switch>
        </Router>
      );
    } else {
      return <Loading />;
    }
  }
}
export default App;
