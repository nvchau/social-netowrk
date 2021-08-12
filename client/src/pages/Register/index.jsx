import React, { useEffect, useState } from "react";
import './index.css';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import authApi from "../../api/authApi";
import { useHistory } from 'react-router-dom';

const Register = () => {
  const history = useHistory()

  const onFinish = async (values) => {
    console.log('Success:', values);

    try {
      const response = await authApi.register(values)
      console.log(response.status)
      if(response.error === 1){
        toast.success(`Email existed !`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if(response.error === 2){
        toast.success(`Cannot load data !`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (response.status === 201) {
        //localStorage.setItem("jwtKey", response.data.token)

        toast.success(`Check your email`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Verify email
        history.push("/verify-email");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  useEffect(() => {
    toast.info(`Welcome to Social Network`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  return (
    <>
      <Row className="register-page">
        <Col span={12} offset={6} style={{ textAlign: 'center' }}>
          <h1>Register</h1>
        </Col>

        <Col span={12} offset={6} className="register-form">
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

            <Form.Item style={{ fontWeight: 'bold' }}
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: 'Please input your first name!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item style={{ fontWeight: 'bold' }}
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: 'Please input your last name!',
                },
              ]}
            >
              <Input />
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
                Register
              </Button>
            </Form.Item>
          </Form>

          {/* <div style={{ textAlign: 'center' }}>
            <h3>No account? <a href="">Register now</a></h3>
          </div> */}
        </Col>
      </Row>
    </>
  )
};

export default Register
