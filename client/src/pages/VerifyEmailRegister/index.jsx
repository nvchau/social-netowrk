import React, { useEffect, useState } from "react";
import './index.css';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import authApi from "../../api/authApi";
import { useHistory } from 'react-router-dom';

const VerifyEmailRegister = () => {
  const history = useHistory()

  const onFinish = async (values) => {
    console.log('Success:', values);

    try {
      const response = await authApi.verifyEmailRegister(values)
      if(response.error === 1){
        toast.success(`Email is incorrect !`, {
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
        toast.success(`Code is incorrect !`, {
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
        //localStorage.setItem("jwtKey", response.data.token)

        toast.success(`Register success`, {
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
      <Row className="verify-page">
        <Col span={12} offset={6} style={{ textAlign: 'center' }}>
          <h1>Verify Email</h1>
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
                Verify
              </Button>
            </Form.Item>
          </Form>

          {/* <div style={{ textAlign: 'center' }}>
            <h3>No account? <a href="/login">Registe now</a></h3>
          </div> */}
        </Col>
      </Row>
    </>
  )
};

export default VerifyEmailRegister;
