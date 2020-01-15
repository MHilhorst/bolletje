import React from 'react';
import { Route, Redirect } from 'react-router-dom';
class LoginWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { component: Component, ...rest } = this.props;
    const { layout: Layout } = this.props;
    const { loaded } = this.state;
    return (
      <Route
        {...rest}
        render={props => {
          if (this.props.user) {
            return (
              <Redirect
                to={{
                  pathname: '/'
                }}
              />
            );
          } else {
            return <Component {...this.props} {...props} />;
          }
        }}
      />
    );
  }
}

export default LoginWrapper;
