import React, { useEffect, useState } from "react";
import './index.css';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import authApi from "../../api/authApi";
import { useHistory } from 'react-router-dom';

const ForgotPassword = () => {
  const history = useHistory()

  const onFinish = async (values) => {
    //console.log('Success:', values);

    try {
      const response = await authApi.forgotPassword(values)
     // console.log(typeof response.data.user_id)
      if (response.status === 200) {
        
        localStorage.setItem("user_id", response.data.user_id)
        
        toast.success(`Check email to set new password `, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Go to home page
        history.push("/verify-email-to-set-new-password");
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
      <Row className="forgot-page">
        <Col span={12} offset={6} style={{ textAlign: 'center' }}>
          <h1>Forgot Password</h1>
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
                Send
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
};

export default ForgotPassword;
