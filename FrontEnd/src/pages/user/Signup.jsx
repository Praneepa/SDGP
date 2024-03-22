import React, { useCallback, useState } from "react";
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
  Alert,
  notification,
} from "antd"; // Importing components and utilities from Ant Design library
import "../../css/login.css"; // Importing CSS file for styling

const { Content } = Layout; // Destructuring Content component from Layout

const SignUp = () => {
  // State variables for form fields, loading state, error state, and privacy policy check
  const [email, setEmail] = useState(""); // State for storing email input value
  const [password, setPassword] = useState(""); // State for storing password input value
  const [confirmPassword, setConfirmPassword] = useState(""); // State for storing confirm password input value

  const [loading, setLoading] = useState(false); // State for indicating loading state during registration
  const [error, setError] = useState(false); // State for indicating registration error
  const [warning, setWarning] = useState(false); // State for indicating password mismatch warning
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false); // State for privacy policy checkbox

  // Function to handle privacy policy checkbox change
  const handlePrivacyPolicyChange = (e) => {
    setIsPrivacyPolicyChecked(e.target.checked);
  };

  // Function to generate a random password
  const generateRandomPassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  };

  // Function to handle form submission
  const register = async () => {
    if (password === confirmPassword) {
      const user = { email, password }; // Creating user object
      try {
        setLoading(true); // Setting loading state to true
        const result = await axios.post("/api/users/register", user); // Making HTTP POST request to register user
        setLoading(false); // Setting loading state to false after registration
        window.location.href = "/login"; // Redirecting to login page after successful registration
      } catch (error) {
        console.log(error);
        setLoading(false); // Setting loading state to false in case of error
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.error === "User with this email already exists."
        ) {
          // If user already exists, show notification
          notification.info({
            message: "User Already Registered",
            description: "The user with this email is already registered.",
            placement: "topLeft",
            btn: (
              // Button to redirect to login page in notification
              <button
                className="notification-btn"
                type="primary"
                size="small"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </button>
            ),
          });
        } else {
          // If other error occurs, show error notification
          notification.error({
            message: "Registration Failed",
            description: "An error occurred while registering the user.",
          });
        }
      }
    } else {
      setWarning(true); // Setting warning state to true if passwords do not match
    }
  };

  // Function to handle form submission success
  const onFinish = (values) => {
    console.log("Success:", values);
    register(); // Calling register function on form submission
  };

  // Function to handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Email validation rule
  const validateEmail = (rule, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email address.");
    }

    // Check if the email ends with the iit domain
    if (!value.toLowerCase().endsWith("@iit.ac.lk")) {
      return Promise.reject("Please enter your student email address ");
    }

    return Promise.resolve();
  };

  // Password validation rule
  const validatePassword = (rule, value) => {
    if (value && value.length < 6) {
      return Promise.reject("Password must be at least 6 characters long.");
    }
    if (value && !/[A-Z]/.test(value)) {
      return Promise.reject("Password must contain at least one capital letter.");
    }
    return Promise.resolve();
  };

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
            <Col
              className="form-section"
              type="flex"
              justify="center"
              align=""
              span={12}
            >
              <Col
                className="inner-form-section"
                type="flex"
                justify="center"
                align=""
                span={12}
              >
                <h2 className="text-align-left">Sign up</h2>

                {/* SignUp Form */}
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
                    {/* Email Input */}
                    <Form.Item
                      name="Email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email",
                        },
                        {
                          validator: validateEmail,
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
                      {
                        validator: validatePassword,
                      },
                    ]}
                  >
                    <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  <div className="m-8">
                    <label className="text-align-left m-8">
                      Confirm password
                    </label>
                  </div>
                  <Form.Item
                    name="Confirm password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    validateStatus={warning ? "error" : ""}
                    help={warning ? "Passwords do not match" : null}
                  >
                    <Input.Password
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                    <div className="signup-agree-label">
                      <Checkbox
                        checked={isPrivacyPolicyChecked}
                        onChange={handlePrivacyPolicyChange}
                      >
                        I agree with <a href="#PrivacyPolicy">Privacy Policy</a>
                      </Checkbox>
                    </div>
                    <Button
                      className="login-btn"
                      type="primary"
                      htmlType="submit"
                      disabled={!isPrivacyPolicyChecked}
                    >
                      Sign up
                    </Button>
                  </Form.Item>
                </Form>
                <p className="text-align-center">
                  Already have an account?{" "}
                  <a className="fw-medium" href="/login">
                    Log in
                  </a>
                </p>
                {error && (
                  <Alert
                    message="Error occurred while signing up"
                    type="error"
                  />
                )}
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
        </Content>
      </Layout>
    </Space>
  );
};
export default SignUp; // Exporting the SignUp component as the default export of this module