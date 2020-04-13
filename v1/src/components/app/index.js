import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect,
} from 'react-router-dom';
import RouteWrapper from './route-wrapper';
import AdminWrapper from './admin-wrapper';
import AdminUsers from '../admin-users';
import AdminProducts from '../admin-products';
import AdminDashboard from '../admin-dashboard';
import AdminOffersDetailed from '../admin-offers-detailed';
import AdminUsersDetailed from '../admin-users-detailed';
import AdminProductsDetailed from '../admin-products-detailed';
import Dashboard from '../dashboard';
// import InventoryOverview from '../inventory-overview';
// import Orders from '../orders';
// import InventoryItemDetailed from '../inventory-item-detailed';
import BaseLayout from '../../layouts/base-layout';
// import OrderDetailed from '../order-detailed';
import Login from '../login';
import Register from '../register';
// import CreateInventoryItem from '../create-inventory-item';
import Loading from '../loading';
// import PriceChecker from '../price-checker';
import Profile from '../profile';
import ProductManagement from '../product-management';
import ProductSoldAnalytics from '../product-sold-analytics';
import ProductSoldAnalyticsDetailed from '../product-sold-analytics-detailed';
import SearchAnalytics from '../search-analytics';
import CreateOffer from '../create-offer';
import { getSession } from '../../utils/auth';
import LoginWrapper from './login-wrapper';
import TrackNewProduct from '../track-new-product';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      loading: true,
      redirect: false,
    };
  }
  async componentDidMount() {
    const session = await getSession();
    if (session) {
      this.setState({ session, loading: false });
    } else {
      this.setState({ loading: false });
    }
    // if (session) {
    //   const response = await fetch(`${config.host}/api/user`, {
    //     method: 'GET',
    //     headers: {
    //       Authorization: `Bearer ${session}`,
    //     },
    //   });
    //   const data = await response.json();
    //   if (response.status === 401) {
    //     Cookies.remove('token');
    //   } else {
    //     this.setState({ loading: false, session, user: data.user });
    //   }
    // } else {
    //   this.setState({ loading: false });
    // }
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
              session={this.state.session}
              {...this.props}
            />
            <Route
              exact
              path="/"
              render={() => {
                return <Link to="/dashboard" />;
              }}
            />
            <RouteWrapper
              exact
              path="/search-analytics"
              component={SearchAnalytics}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/create-offer"
              component={CreateOffer}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/product-sold-analytics"
              component={ProductSoldAnalytics}
              layout={BaseLayout}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/track-product"
              component={TrackNewProduct}
              layout={BaseLayout}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              path="/product-sold-analytics/:id"
              component={ProductSoldAnalyticsDetailed}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              path="/product-management/:id"
              component={ProductManagement}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />{' '}
            {/* <RouteWrapper
              exact
              path="/inventory-overview"
              component={InventoryOverview}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/inventory/:id"
              component={InventoryItemDetailed}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/inventory-overview/create"
              component={CreateInventoryItem}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            /> */}
            {/* <RouteWrapper
              exact
              path="/price-checker"
              component={PriceChecker}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            /> */}
            {/* <RouteWrapper
              exact
              path="/orders"
              component={Orders}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <RouteWrapper
              exact
              path="/order/:id"
              component={OrderDetailed}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            /> */}
            <RouteWrapper
              exact
              path="/profile"
              component={Profile}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <LoginWrapper
              exact
              path="/login"
              component={Login}
              {...this.props}
              session={this.state.session}
            />
            <Route
              exact
              path="/register"
              component={Register}
              render={(props) => {
                if (this.state.user) {
                  return (
                    <Redirect
                      to={{
                        pathname: '/dashboard',
                      }}
                    />
                  );
                } else {
                  return <Login {...this.props} {...props} />;
                }
              }}
            />
            <AdminWrapper
              exact
              path="/admin/users"
              component={AdminUsers}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <AdminWrapper
              exact
              path="/admin/users/:id"
              component={AdminUsersDetailed}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <AdminWrapper
              exact
              path="/admin/products"
              component={AdminProducts}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <AdminWrapper
              exact
              path="/admin/products/:id"
              component={AdminProductsDetailed}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <AdminWrapper
              exact
              path="/admin/offers/:id"
              component={AdminOffersDetailed}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
            />
            <AdminWrapper
              exact
              path="/admin/dashboard"
              component={AdminDashboard}
              layout={BaseLayout}
              user={this.state.user}
              session={this.state.session}
              {...this.props}
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
