import React from 'react';
import { Route, Redirect } from 'react-router-dom';
class RouteWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { component: Component, ...rest } = this.props;
    const { layout: Layout } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          if (this.props.user) {
            return (
              <Layout {...this.props} {...props}>
                <Component {...this.props} {...props} />
              </Layout>
            );
          } else {
            return (
              <Redirect
                to={{
                  pathname: '/login'
                }}
              />
            );
          }
        }}
      />
    );
  }
}

export default RouteWrapper;
