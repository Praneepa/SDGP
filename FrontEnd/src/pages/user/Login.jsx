import React, { useState } from "react";
import axios from "axios"; // Importing axios for making HTTP requests
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
} from "antd"; // Importing components and utilities from Ant Design library

import "../../css/login.css"; // Importing CSS file for styling

const { Content } = Layout; // Destructuring Content component from Layout

const Login = () => {
  // State variables for email, password, loading state, and remember me checkbox
  const [email, setEmail] = useState(""); // State for storing email input value
  const [password, setPassword] = useState(""); // State for storing password input value
  const [loading, setLoading] = useState(false); // State for indicating loading state during login
  const [isRememberMe, setIsRememberMe] = useState(false); // State for storing remember me checkbox status

  // Function to handle changes in the remember me checkbox
  const handleRememberMeChange = (e) => {
    setIsRememberMe(e.target.checked);
  };

  // Function to display notification for login failure
  const handleLoginFailedNotification = (description) => {
    notification.error({
      message: "User Login Failed",
      description,
      placement: "topLeft", // Notification placement on the screen
    });
  };

  // Function to handle successful form submission
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  // Function to handle failed form submission
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Function to handle user login
  async function login() {
    const user = {
      email,
      password,
    };
    try {
      setLoading(true); // Set loading state to true during login process
      const { data, status } = await axios.post("/api/users/login", user); // Sending login request to the server
      setLoading(false); // Set loading state to false after receiving response

      if (status === 200) { // If login is successful
        localStorage.setItem("currentUser", JSON.stringify(data)); // Store user data in localStorage
        if (data.isAdmin) { // Redirecting user based on admin status
          window.location.href = "/admin/places"; // Redirecting to admin dashboard
        } else {
          window.location.href = "/home"; // Redirecting to user dashboard
        }
      } else { // If login fails
        handleLoginFailedNotification("Login failed. Please try again."); // Display login failure notification
      }
    } catch (error) {
      setLoading(false); // Set loading state to false in case of error
      if (error.response && error.response.status === 404) { // Handling specific error statuses
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
            {/* Form section */}
            <Col className="form-section" span={12}>
              <Col className="inner-form-section" span={12}>
                <h1 className="text-align-left">Login</h1>

                {/* Login Form */}
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
                  {/* Email Input */}
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

                  {/* Password Input */}
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

                  {/* Login Button */}
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

                {/* Remember me checkbox and Forgot password link */}
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
                  <a href="#">Forgot password</a>{" "}
                </div>

                {/* Link to Sign Up page */}
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

            {/* Placeholder for login picture */}
            <Col
              className="login-pic"
              type="flex"
              justify="space-around"
              align="middle"
              span={12}
            ></Col>
          </Row>
        </Content>
      </Layout>
    </Space>
  );
};

export default Login;
