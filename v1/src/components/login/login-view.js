import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Input, Icon, Button, Typography, Alert } from 'antd';
import {
  LoginBox,
  LoginContainerBox,
  LoginHeader,
  LoginInput,
} from '../../styles/style';
import { setToken, userLogin } from '../../utils/auth';
import { MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      errorLogin: false,
      redirect: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };
  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = async (event) => {
    if (event) event.preventDefault();
    const data = await userLogin({
      email: this.state.email,
      password: this.state.password,
    });

    if (data.token) {
      setToken(data.token);
      window.location.reload();
    } else {
      this.setState({ errorLogin: true });
    }
  };

  handleEnterSubmit = async (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  };

  render() {
    if (!this.state.redirect) {
      return (
        <LoginContainerBox>
          <img
            src={require('../../assets/images/logo.png')}
            width={150}
            alt={'Logo'}
          />
          <LoginBox>
            <LoginHeader>
              <div style={{ textAlign: 'center' }}>
                <Title level={4}>Login to Account</Title>
                <Text style={{ fontSize: 16 }}>
                  Please enter your email and password to continue
                </Text>
              </div>
            </LoginHeader>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <div style={{ width: '90%  ' }}>
                <LoginInput>
                  <Input
                    prefix={
                      <MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="E-mail"
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
                    style={{ marginBottom: 6 }}
                    onKeyDown={this.handleEnterSubmit}
                  />
                  <Text style={{ fontSize: 13 }}>
                    {this.state.errorLogin && (
                      <Alert
                        message="Credentials are wrong"
                        type="error"
                        style={{ marginTop: 12, marginBottom: 12 }}
                        showIcon
                      />
                    )}
                    {/* Forgot your password? Click{' '} */}
                    {/* <a href="/docs/spec/proximity">here.</a> */}
                  </Text>
                </LoginInput>
                <div
                  style={{
                    marginTop: 25,
                    marginBottom: 40,
                    textAlign: 'center',
                  }}
                >
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
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>
                      Or <a href="/register">create</a> an account
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </LoginBox>
          <Text style={{ color: '#c2c2c2', fontSize: 13, marginTop: 64 }}>
            Snapse © 2020. Version 1.0.1
          </Text>
        </LoginContainerBox>
      );
    } else {
      return <Redirect to={{ pathname: '/dashboard' }} />;
    }
  }
}

export default withRouter(LoginView);
