import React, { useState } from "react";
import axios from "axios";
import {
  Layout,
  Space,
  Col,
  Row,
  Button,
  Form,
  Input,
  Checkbox,
  notification,
} from "antd";

import "../../css/login.css";
import { UserOutlined } from "@ant-design/icons";

const { Content } = Layout;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);

  const handleRememberMeChange = (e) => {
    setIsRememberMe(e.target.checked);
  };

  const handleLoginFailedNotification = (description) => {
    notification.error({
      message: "User Login Failed",
      description,
      placement: "topLeft",
    });
  };

  const redirectToAdminLogin = () => {
    window.location.href = "/admin-login";
  };
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  async function login() {
    const user = {
      email,
      password,
    };
    try {
      setLoading(true);
      const { data, status } = await axios.post("https://sdgp-chi.vercel.app/api/users/login", user);
      setLoading(false);

      if (status === 200) {
        localStorage.setItem("currentUser", JSON.stringify(data));
        if (data.isAdmin) {
          window.location.href = "/admin/places";
        } else {
          window.location.href = "/home";
        }
      } else {
        handleLoginFailedNotification("Login failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        handleLoginFailedNotification("User not found.");
      } else if (error.response && error.response.status === 400) {
        handleLoginFailedNotification("Incorrect password.");
      } else {
        handleLoginFailedNotification("An error occurred. Please try again.");
      }
    }
  }

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={[0, 48]}
      className="space"
    >
      <Layout>
        <Content>
          <Row className="main-col">
            <Col className="form-section" span={12}>
              <Col className="innter-form-section" span={12}>
                <h1 className="text-align-left">Login</h1>

                <Form
                  style={{
                    maxWidth: 600,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <div className="m-8">
                    <label className="text-align-left m-8">Email</label>
                  </div>
                  <div>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email!",
                        },

                        {
                          pattern: /^[a-zA-Z0-9._%+-]+@iit\.ac\.lk$/,
                          message: "Please enter your student email address ",
                        },
                      ]}
                    >
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div className="m-8">
                    <label className="text-align-left m-8">Password</label>
                  </div>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    className="sign-up-btn-col"
                    wrapperCol={{
                      offset: 0,
                      span: 24,
                    }}
                  >
                    <Button
                      onClick={login}
                      className="login-btn"
                      type="primary"
                      htmlType="submit"
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
                <div className="forget-pw">
                  <Checkbox
                    checked={isRememberMe}
                    onChange={handleRememberMeChange}
                  >
                    <a
                      title={
                        isRememberMe
                          ? "You are Remembered!"
                          : "Click to Remember"
                      }
                    >
                      Remember me
                    </a>
                  </Checkbox>{" "}
                  <a href="/forget-password">Forgot password</a>{" "}
                </div>
                <div className="login-acc-have">
                  <p className="text-align-center">
                    Don't you have an account?{" "}
                    <a className="fw-medium" href="/signup">
                      Sign up
                    </a>{" "}
                  </p>
                </div>
              </Col>
            </Col>
            <Col
              className="login-pic"
              type="flex"
              justify="space-around"
              align="middle"
              span={12}
            ></Col>
          </Row>
          <Button
            type="primary"
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
            }}
            onClick={redirectToAdminLogin}
          >
            <UserOutlined />
            <span style={{ marginLeft: 5 }}>Instructor Login</span>
          </Button>
        </Content>
      </Layout>
    </Space>
  );
};

export default Login;