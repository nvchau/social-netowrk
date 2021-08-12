import React, { useEffect } from "react";
import './index.css';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import authApi from "../../api/authApi";
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory()
  localStorage.clear()
  const onFinish = async (values) => {
    console.log('Success:', values);

    try {
      const response = await authApi.login(values)

      if (response.status === 200) {
        localStorage.setItem("jwtKey", response.data.token)

        toast.success(`Login success`);

        // Go to home page
        history.push("/");
      } else {
        toast.error(`Email or password is incorrect`);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  useEffect(() => {
    toast.info(`Welcome to Social Network`);
  }, []);

  return (
    <>
      <Row className="login-page">
        <Col span={12} offset={6} style={{ textAlign: 'center', height: '50px' }}>
          <h1>Welcome back</h1> <br />
          <h1 style={{ color: '#3498db'}}><b>Social Network</b></h1>
        </Col>

        <Col span={12} offset={6} className="login-form">
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item style={{ fontWeight: 'bold' }}
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item style={{ fontWeight: 'bold' }}
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  min: 8,
                  message: 'Minimum of 8 characters!',
                }
              ]}
            >
              <Input.Password />
            </Form.Item>

            
            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <h3>No account? <a href="/register">Register now</a></h3>
            <h3>Forgot Password? <a href="/set-new-password">Set new Password</a></h3>
          </div>
        </Col>
      </Row>
    </>
  )
};

export default Login;
