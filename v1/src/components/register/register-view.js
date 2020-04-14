import React from 'react';
import { Input, Icon, Button, Typography } from 'antd';
import {
  LoginBox,
  LoginContainerBox,
  LoginHeader,
  LoginInput,
} from '../../styles/style';
import { setToken } from '../../utils/auth';

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

  handleSubmit = async () => {
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
        }),
      }
    );
    const data = await response.json();
    console.log(data.token);
    if (setToken(data.token)) {
      this.props.history.push('/dashboard');
    }
  };
  render() {
    return (
      <LoginContainerBox>
        <LoginBox>
          <LoginHeader>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>Register Account</Title>
              <Text>Please enter your email and password to continue</Text>
            </div>
          </LoginHeader>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
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
              </LoginInput>
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
                  <Text>
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
