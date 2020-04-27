import React from 'react';
import { Input, Icon, Button, Typography, Alert } from 'antd';
import {
  LoginBox,
  LoginContainerBox,
  LoginHeader,
  LoginInput,
} from '../../styles/style';
import { MailOutlined } from '@ant-design/icons';

const validateEmail = (email) => {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
};
const { Title, Text } = Typography;
class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      errorLogin: false,
      redirect: false,
      registerError: false,
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
  handleConfirmPasswordChange = (e) => {
    this.setState({ passwordConfirm: e.target.value });
  };
  handleFirstNameChange = (e) => {
    this.setState({ firstName: e.target.value });
  };
  handleLastNameChange = (e) => {
    this.setState({ lastName: e.target.value });
  };
  handleSubmit = async () => {
    if (this.state.password === this.state.passwordConfirm) {
      if (validateEmail(this.state.email)) {
        this.setState({ loading: true, errorLogin: false });
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/auth/register`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.state.email,
              password: this.state.password,
              first_name: this.state.firstName,
              last_name: this.state.lastName,
            }),
          }
        );
        const data = await response.json();
        if (data.error) {
          this.setState({
            registerError: 'Please retry again using other credentials',
            loading: false,
          });
        }
        if (data.user) {
          // this.props.history.push({ pathname: '/login',state:{ verfiyEmail: true} });
          this.props.history.push('/login', { email: true });
        }
      } else {
        this.setState({
          registerError: 'Please make sure you use a valid e-mail address.',
        });
      }
    } else {
      this.setState({ registerError: 'Please make sure the passwords match' });
    }
  };
  render() {
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
              <Title level={4}>Register Account</Title>
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
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="E-mail"
                  onChange={this.handleEmailChange}
                />
              </LoginInput>
              <LoginInput>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="First Name"
                  onChange={this.handleFirstNameChange}
                />
              </LoginInput>
              <LoginInput>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Last Name"
                  onChange={this.handleLastNameChange}
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
                />
              </LoginInput>
              <LoginInput>
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Confirm Password"
                  onChange={this.handleConfirmPasswordChange}
                  style={{ marginBottom: 5 }}
                />
              </LoginInput>
              {this.state.registerError && (
                <Alert
                  type="warning"
                  showIcon
                  message={this.state.registerError}
                />
              )}
              <div
                style={{
                  marginTop: 20,
                  marginBottom: 40,
                  textAlign: 'center',
                }}
              >
                {this.state.errorLogin && (
                  <div style={{ marginBottom: 5 }}>
                    <Text type="danger">Register account</Text>
                  </div>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={() => this.handleSubmit()}
                  style={{ width: '100%' }}
                  loading={this.state.loading}
                >
                  Create Account
                </Button>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>
                    Or <a href="/login">Login</a> to an existing account
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </LoginBox>
      </LoginContainerBox>
    );
  }
}

export default RegisterView;
