import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect,
} from 'react-router-dom';
import RouteWrapper from './route-wrapper';
import MediumSubscriptionWrapper from './medium-subscription-wrapper';
import AdminWrapper from './admin-wrapper';
import AdminUsers from '../admin-users';
import AdminProducts from '../admin-products';
import AdminDashboard from '../admin-dashboard';
import AdminOffersDetailed from '../admin-offers-detailed';
import AdminUsersDetailed from '../admin-users-detailed';
import AdminRepricerOffer from '../admin-repriceroffers-detailed';
import AdminProductsDetailed from '../admin-products-detailed';
import StrategyBuilder from '../strategy';
import Dashboard from '../dashboard';
import BaseLayout from '../../layouts/base-layout';
import Login from '../login';
import Register from '../register';
import Loading from '../loading';
import PriceChecker from '../price-checker';
import PriceCheckerDetailed from '../price-checker-detailed';
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
  }
  render() {
    if (!this.state.loading) {
      return (
        <Router>
          <Suspense fallback={null}>
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
              />
              <MediumSubscriptionWrapper
                exact
                path="/price-checker"
                component={PriceChecker}
                layout={BaseLayout}
                user={this.state.user}
                session={this.state.session}
                {...this.props}
              />
              <MediumSubscriptionWrapper
                exact
                path="/price-checker/:id"
                component={PriceCheckerDetailed}
                layout={BaseLayout}
                user={this.state.user}
                session={this.state.session}
                {...this.props}
              />
              <MediumSubscriptionWrapper
                exact
                path="/strategy-builder"
                component={StrategyBuilder}
                layout={BaseLayout}
                user={this.state.user}
                session={this.state.session}
                {...this.props}
              />
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
              <AdminWrapper
                exact
                path="/admin/repricer-offers/:id"
                component={AdminRepricerOffer}
                layout={BaseLayout}
                user={this.state.user}
                session={this.state.session}
                {...this.props}
              />
            </Switch>
          </Suspense>
        </Router>
      );
    } else {
      return <Loading />;
    }
  }
}
export default App;
