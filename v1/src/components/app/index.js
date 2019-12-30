import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RouteWrapper from "./route-wrapper";
import Dashboard from "../dashboard";
import BaseLayout from "../../layouts/base-layout";
import Login from "../login";
import Loading from "../loading";
import PriceChecker from "../price-checker";
import Profile from "../profile";
import ProductSoldAnalytics from "../product-sold-analytics";
import ProductSoldAnalyticsDetailed from "../product-sold-analytics-detailed";
import Cookies from "js-cookie";
import config from "../../config";
import SearchAnalytics from "../search-analytics";
import CreateOffer from "../create-offer";
const jwt = Cookies.get("token");

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
      method: "GET",
      headers: {
        Authorization: jwt
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.user);
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
              path="/"
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
              exact
              path="/price-checker"
              component={PriceChecker}
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
            <Route exact path="/login" component={Login} />
          </Switch>
        </Router>
      );
    } else {
      return <Loading />;
    }
  }
}
export default App;
