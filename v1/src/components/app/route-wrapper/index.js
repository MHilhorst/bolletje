import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
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
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/user`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.props.session}`,
          },
        }
      );
      const data = await response.json();
      if (response.status === 401) {
        console.log('removing');
        Cookies.remove('token');
        // this.props.history.push('/login');
        window.location.reload();
      } else {
        this.setState({ user: data.user, loading: false });
      }
    } else {
      this.props.history.push('/login');
      // window.location.replace('/login');
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
            if (this.props.session) {
              return (
                <Layout {...this.props} {...props} {...this.state}>
                  <Component {...this.props} {...props} {...this.state} />
                </Layout>
              );
            } else {
              return (
                <Redirect
                  to={{
                    pathname: '/login',
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
