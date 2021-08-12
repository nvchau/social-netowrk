import React, { useEffect, useState } from "react";
import './index.css';
import { Row, Col, Button, Form, Input, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import authApi from "../../api/authApi";
import { toast } from 'react-toastify';

const { Option } = Select;

const Profile = (props) => {
    const { token, user } = props;

    const [image, setImage] = useState(null)
    const [imgData, setImgData] = useState(`${user?.avatar ? process.env.REACT_APP_API_URL+'/'+user?.avatar : 'images/default-avatar.png'}`)

    const onChangeImage = (evt) => {
        if (evt.target.files[0]) {
          setImage(evt.target.files[0])
          const reader = new FileReader()
          reader.addEventListener("load", () => {
            setImgData(reader.result)
          })
          reader.readAsDataURL(evt.target.files[0])
        }
    }

    const changeAvatar = async () => {
        if (image === null) {
            toast.error(`Please choose a photo`)
            return false
        }

        const newAvatar = await authApi.changeAvatar({token, image})

        if (newAvatar.status === 200) {
            toast.success(`Change avatar successfully`)
            return false
        } else {
            toast.error(`An error occurred, please try again`)
            return false
        }
    }

    const email = user?.email
    const firstName = user?.firstName
    const lastName = user?.lastName
    const address = user?.address
    const gender = user?.gender

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const onSaveChangeInfo = async (values) => {
        console.log('Success:', values);

        let gender = false
        if (parseInt(values.gender) === 1) {
            gender = true
        }

        const data = {
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.address,
            gender: gender
        }

        console.log({data})

        const response = await authApi.updateInfo({token, data})
    
        if (response.status === 200) {
            toast.success(`Change information successfully`);
            return false
        } else {
            toast.error(`An error occurred, please try again`);
            return false
        }
    }

    return (
        <Row justify="center" align="top" className="profile">
            <Col span={6} className="profile-avatar">
                <img className="avatar" src={imgData} alt="" />
                <label className="upload-file">
                    <input type="file" required
                        onChange={(evt) => {
                            onChangeImage(evt)
                        }}
                    />
                    <FontAwesomeIcon icon={faUpload} /> Select new avatar
                    
                    <Button type="primary" style={{ position: 'absolute', left: 32, bottom: -50 }}
                        onClick={() => {
                            changeAvatar()
                        }}
                    >Save change avatar</Button>
                </label>
            </Col>
            <Col span={10}>
                <div style={{ textAlign: 'center', marginBottom: 35 }}>
                    <h1 style={{ color: '#1890ff' }}>Your profile</h1>
                </div>
                <Form
                    name="basic"
                    labelCol={{
                        span: 5,
                    }}
                    wrapperCol={{
                        span: 19,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onSaveChangeInfo}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item style={{ fontWeight: 'bold' }}
                        label="Email"
                    >
                        <Input disabled={true} defaultValue={email} />
                    </Form.Item>

                    <Form.Item style={{ fontWeight: 'bold' }}
                        label="First name"
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your firstname!',
                            },
                        ]}
                    >
                        <Input defaultValue={firstName} />
                    </Form.Item>

                    <Form.Item style={{ fontWeight: 'bold' }}
                        label="Last name"
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your lastname!',
                            },
                        ]}
                    >
                        <Input defaultValue={lastName} />
                    </Form.Item>

                    <Form.Item style={{ fontWeight: 'bold' }}
                        label="Address"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your address!',
                            },
                        ]}
                    >
                        <Input defaultValue={address} />
                    </Form.Item>

                    <Form.Item style={{ fontWeight: 'bold' }}
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select gender!' }]}
                    >
                        <Select placeholder="select your gender" defaultValue={ gender === true ? 'Male' : 'Female' }>
                            <Option value="1">Male</Option>
                            <Option value="0">Female</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 19,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Save change information
                        </Button>
                    </Form.Item>

                </Form>
            </Col>
        </Row>
    )
}

export default Profile;
