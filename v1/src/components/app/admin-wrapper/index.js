import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import config from '../../../config';
import Loading from '../../loading';
class RouteWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loading: true,
    };
  }
  async componentDidMount() {
    if (this.props.session) {
      const response = await fetch(`${config.host}/api/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.props.session}`,
        },
      });
      const data = await response.json();
      if (response.status === 401) {
        console.log('removing');
        Cookies.remove('token');
        this.props.history.push('/login');
      } else {
        if (data.user.admin_account) {
          this.setState({ user: data.user, loading: false });
        } else {
          this.props.history.push('/dashboard');
        }
      }
    } else {
      this.props.history.push('/login');
    }
  }
  render() {
    if (!this.state.loading) {
      const { component: Component, ...rest } = this.props;
      const { layout: Layout } = this.props;
      return (
        <Route
          {...rest}
          render={(props) => {
            if (this.props.session && this.state.user.admin_account) {
              return (
                <Layout {...this.props} {...props} {...this.state}>
                  <Component {...this.props} {...props} {...this.state} />
                </Layout>
              );
            } else {
              return (
                <Redirect
                  to={{
                    pathname: '/dashboard',
                    state: { from: props },
                  }}
                />
              );
            }
          }}
        />
      );
    } else {
      return <Loading />;
    }
  }
}

export default withRouter(RouteWrapper);
