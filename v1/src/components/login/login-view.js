import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Spin, Input, Icon, Button, Typography, Col, Layout } from 'antd';
import {
  LoginBox,
  LoginContainerBox,
  LoginHeader,
  LoginInput,
  subText
} from '../../styles/style';
import Cookies from 'js-cookie';
import config from '../../config';

const { Title, Text } = Typography;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      errorLogin: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = () => {
    this.setState({ loading: true, errorLogin: false });
    fetch(`${config.host}/api/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          const { token } = data;
          Cookies.set('token', token, { expires: 1 });
          setTimeout(() => {
            this.props.history.push('/');
          }, 2000);
        }
        if (data.error) {
          this.setState({ loading: false, errorLogin: true });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <LoginContainerBox>
        <LoginBox>
          <LoginHeader>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>Login to Account</Title>
              <Text>Please enter your email and password to continue</Text>
            </div>
          </LoginHeader>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20
            }}
          >
            <div style={{ width: '80%  ' }}>
              <LoginInput>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Username"
                  onChange={this.handleEmailChange}
                />
              </LoginInput>
              <LoginInput>
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                  onChange={this.handlePasswordChange}
                  style={{ marginBottom: 5 }}
                />
                <subText>
                  Forgot your password? Click{' '}
                  <a href="/docs/spec/proximity">here.</a>
                </subText>
              </LoginInput>
              <div
                style={{
                  marginTop: 20,
                  marginBottom: 40,
                  textAlign: 'center'
                }}
              >
                {this.state.errorLogin && (
                  <div style={{ marginBottom: 5 }}>
                    <Text type="danger">Login has failed.</Text>
                  </div>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.handleSubmit}
                  style={{ width: '100%' }}
                  loading={this.state.loading}
                >
                  Log in
                </Button>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 10
                  }}
                >
                  <subText>
                    Or <a href="/register">create</a> an account
                  </subText>
                </div>
              </div>
            </div>
          </div>
        </LoginBox>
      </LoginContainerBox>
    );
  }
}

export default LoginView;
