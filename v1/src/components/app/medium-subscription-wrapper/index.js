import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import Loading from '../../loading';
import { Result, Button } from 'antd';
class MediumSubscriptionWrapper extends React.Component {
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
        this.props.history.push('/login');
      } else {
        this.setState({ user: data.user, loading: false });
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
            if (
              this.props.session &&
              this.state.user.subscription.account_type === 'MEDIUM'
            ) {
              return (
                <Layout {...this.props} {...props} {...this.state}>
                  <Component {...this.props} {...props} {...this.state} />
                </Layout>
              );
            } else {
              return (
                <Layout {...this.props} {...props} {...this.state}>
                  <Result
                    status="403"
                    title="Access Denied"
                    subTitle="Sorry, The Repricer is only available for businesses with a MEDIUM subscription"
                    extra={
                      <Button
                        type="primary"
                        onClick={() => this.props.history.push('/profile')}
                      >
                        Change Subscription
                      </Button>
                    }
                  />
                </Layout>
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

export default withRouter(MediumSubscriptionWrapper);
