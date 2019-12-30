import React from "react";
import {
  Form,
  Input,
  Icon,
  Checkbox,
  Button,
  Row,
  Col,
  Typography
} from "antd";
import { LoginBox } from "../../styles/style";
import Cookies from "js-cookie";
import config from "../../config";

const { Title } = Typography;

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
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
    console.log("submitting");
    fetch(`${config.host}/api/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(data => {
        const { token } = data;
        Cookies.set("token", token, { expires: 1 });
        this.props.history.push("/");
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <Row>
        <Col span={12}>
          <div>
            <img
              src={require("../../assets/images/bg.jpg")}
              style={{
                width: "100%",
                height: "100vh",
                objectFit: "cover"
              }}
            />
          </div>
        </Col>
        <Col span={12}>
          <LoginBox>
            <Col xs={20} sm={20} md={20} lg={10}>
              <div>
                <Title level={2}>Login</Title>
                <Form className="login-form">
                  <Form.Item>
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Username"
                      onChange={this.handleEmailChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Password"
                      onChange={this.handlePasswordChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      onClick={this.handleSubmit}
                    >
                      Log in
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </LoginBox>
        </Col>
      </Row>
    );
  }
}

export default LoginView;
