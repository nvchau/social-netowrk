import React, { useEffect, useState } from "react";
import './index.css';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import authApi from "../../api/authApi";
import { useHistory } from 'react-router-dom';

const VerifyEmailForgotPassword = () => {
  const history = useHistory()

  const onFinish = async (values) => {
    try {
      const response = await authApi.verifyEmailForgotPassword(values)
      console.log(response)
      if(response.error === 1){
        toast.success(`Email is incorrect`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
  
      }
      if (response.status === 200) {
        toast.success(`Set new password success`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Go to home page
        history.push("/login");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  return (
    <>
      <Row className="verify-forgot-password-page">
        <Col span={12} offset={6} style={{ textAlign: 'center' }}>
          <h1>Set new password</h1>
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
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Please input your code!',
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
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
};

export default VerifyEmailForgotPassword;
