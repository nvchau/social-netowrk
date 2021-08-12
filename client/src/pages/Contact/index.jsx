import React, { useEffect, useState } from "react";
import './index.css';
import { Layout, Tabs, Button, List, Avatar, Input, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUserCheck, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import friendApi from "../../api/friendApi";
import Notifier from "react-desktop-notification"
import socket from '../../helpers/socketio';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;

const Contact = (props) => {
    const { token, user, pushNotification } = props;

    const [friendList, setFriendList] = useState()
    const [requests, setRequests] = useState()
    const [users, setUsers] = useState()

    // Friend list
    const fetchFriendList = async () => {
        try {
            const response = await friendApi.getAllFriend(token)
            setFriendList(response.data)
        } catch (error) {
            console.log({error: error})
        }
    }

    useEffect(() => {
        (async () => {
            fetchFriendList()
        })()
    }, [friendList === undefined])

    // Friend request
    const fetchFriendRequest = async () => {
        try {
            const response = await friendApi.getAllFriendRequest(token)
            setRequests(response.data)
        } catch (error) {
            console.log({error: error})
        }
    }

    useEffect(() => {
        (async () => {
            await fetchFriendRequest()
        })()
    }, [requests === undefined])

    // All Users
    const fetchUsers = async () => {
        try {
            const response = await friendApi.getAllUser()
            setUsers(response.data)
        } catch (error) {
            console.log({error: error})
        }
    }

    let [notFriends, setNotFriends] = useState()
    // filter user is not friend
    const filterNotFriend = async () => {
        notFriends = users && [...users]
        users && users.forEach(item => {
            requests && requests.forEach(req => {
                if (item.id === req.senderId || item.id === req.receiveId) {
                    const index = notFriends && notFriends.indexOf(item);
                    if (index > -1) {
                        notFriends.splice(index, 1);
                    }
                }
            })
        })

        setNotFriends(notFriends)
    }
    useEffect(() => {
        (async () => {
            await fetchUsers()
            
            filterNotFriend()
        })()
    }, [users === undefined])

    // Search user
    const onSearch = value => console.log(value)

    // Add friend (send request to someone)
    const addFriend = async ({userId}) => {
        const newRequest = await friendApi.addFriend({ token, userId })
        socket.emit('addFriend', ({senderId: user.id, receiverId: userId, newRequest: newRequest.data}))

        await fetchFriendRequest()
    }

    // receive friend request form socket (when someone sends you a friend request)
    useEffect(() => {
        socket.on('addFriendRequest', async newRequest => {
            // console.log({newRequest})
            if (newRequest && parseInt(newRequest.receiver.id) === user.id) {
                await fetchFriendRequest()

                let notiPush = new Object()
                notiPush.title = `You have new friend request from ${newRequest.sender.firstName} ${newRequest.sender.lastName}`
                notiPush.content = `Sent at ${new Date(newRequest.createdAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })}`
                notiPush.url = `http://localhost:3001/contact`
                notiPush.image = `${newRequest.sender.avatar ? process.env.REACT_APP_API_URL+'/'+newRequest.sender.avatar : 'images/default-avatar.png'}`

                pushNotification(notiPush)
            }
        })
    }, [])

    // Accept friend (accept someone)
    const acceptFriend = async (receiverId) => {
        const acceptRequest = await friendApi.acceptFriend({ token, receiverId })
        socket.emit('acceptFriend', ({senderId: user.id, receiverId: receiverId, acceptRequest: acceptRequest.data}))

        await fetchFriendRequest()
        await fetchFriendList()
    }

    // receive accept friend form socket (when someone accepts you as a friend)
    useEffect(() => {
        socket.on('acceptFriendRequest', async acceptRequest => {
            if (parseInt(acceptRequest.receiver.id) === user.id) {
                await fetchFriendRequest()
                await fetchFriendList()
            }
            // console.log({acceptRequest})
            if (parseInt(acceptRequest.sender.id) === user.id) {
                await fetchFriendRequest()
                await fetchFriendList()

                let notiPush = new Object()
                notiPush.title = `${acceptRequest.receiver.firstName} ${acceptRequest.receiver.lastName} accepted your friend request`
                notiPush.content = `Accept at ${new Date(acceptRequest.updatedAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })}`
                notiPush.url = `http://localhost:3001/contact`
                notiPush.image = `${acceptRequest.receiver.avatar ? process.env.REACT_APP_API_URL+'/'+acceptRequest.receiver.avatar : 'images/default-avatar.png'}`

                pushNotification(notiPush)
            }
        })
    }, [])

    // Reject friend request
    const rejectFriend =  async (senderId) => {
        const rejectRequest = await friendApi.rejectFriend({ token, senderId })
        socket.emit('rejectFriend', ({receiverId: user.id, senderId, rejectRequest: rejectRequest.data}))

        await fetchFriendRequest()
        await fetchFriendList()
    }

    // receive reject friend form socket
    useEffect(() => {
        socket.on('rejectFriendRequest', async ({receiverId, senderId, rejectRequest}) => {
            if (parseInt(senderId) === user.id) {
                await fetchFriendRequest()
                await fetchFriendList()
            }
        })
    }, [])

    // Delete friend request (by sender)
    const deleteFriendRequest =  async (receiverId) => {
        const deleteRequest = await friendApi.deleteFriendRequest({ token, receiverId })
        socket.emit('deleteFriendRequest', ({sender: user.id, receiverId, deleteRequest: deleteRequest.data}))

        await fetchFriendRequest()
        await fetchFriendList()
    }

    useEffect(() => {
        socket.on('getDeleteFriendRequest', async ({senderId, receiverId, rejectRequest}) => {
            if (parseInt(receiverId) === user.id) {
                await fetchFriendRequest()
                await fetchFriendList()
            }
        })
    }, [])

    // Delete friend by sender
    const deleteFriendSender =  async (receiverId) => {
        const deleteRequest = await friendApi.deleteFriendBySender({ token, receiverId })
        socket.emit('deleteFriendBySender', ({sender: user.id, receiverId, deleteRequest: deleteRequest.data}))

        await fetchFriendList()
    }

    useEffect(() => {
        socket.on('getDeleteFriendBySender', async ({senderId, receiverId, rejectRequest}) => {
            if (parseInt(receiverId) === user.id) {
                await fetchFriendList()
            }
        })
    }, [])

    const { confirm } = Modal;
    const showDeleteFriendSender = ({receiverId, friendName}) => {
        confirm({
            title: `Are you sure delete ${friendName}?`,
            icon: <ExclamationCircleOutlined />,
            content: 'Please consider carefully',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteFriendSender(receiverId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // Delete friend by receiver
    const deleteFriendReceiver =  async (senderId) => {
        const deleteRequest = await friendApi.deleteFriendByReceiver({ token, senderId })
        socket.emit('deleteFriendByReceiver', ({senderId: senderId, receiverId: user.id, deleteRequest: deleteRequest.data}))

        await fetchFriendList()
    }

    useEffect(() => {
        socket.on('getDeleteFriendByReceiver', async ({senderId, receiverId, rejectRequest}) => {
            if (parseInt(senderId) === user.id) {
                await fetchFriendList()
            }
        })
    }, [])

    const showDeleteFriendReceiver = ({senderId, friendName}) => {
        confirm({
            title: `Are you sure delete ${friendName}?`,
            icon: <ExclamationCircleOutlined />,
            content: 'Please consider carefully',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteFriendReceiver(senderId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    return (
    <Layout>
        <Content style={{ padding: '0 50px', marginTop: 15 }}>
            <Tabs defaultActiveKey="1" tabPosition={'left'} style={{ height: 815 }} width='250px' className="tab-scroll">
                <TabPane 
                    tab={`Friend list`}
                    key={'1'} 
                    style={{ padding: '15px'}}
                >
                    {friendList && [...friendList].map((item, index) => (
                        (item.receiver.id === user.id) ?
                        <List.Item
                            actions={[
                                <Button key="list-loadmore-delete" style={{ color: 'red' }}
                                    onClick={() => {
                                        showDeleteFriendReceiver({senderId: item.sender.id, friendName: item.sender.firstName +' '+ item.sender.lastName})
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />&nbsp;Delete
                                </Button>
                            ]}
                            style={{ borderBottom: '1px solid #dadada' }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={
                                    `${item.sender.avatar ? process.env.REACT_APP_API_URL+'/'+item.sender.avatar : 'images/default-avatar.png'}`
                                } />}
                                title={`${item.sender.firstName} ${item.sender.lastName}`}
                                description={
                                    `Became friends on ${new Date(item.updatedAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })}`
                                }
                            />
                        </List.Item>
                        :
                        <List.Item
                            actions={[
                                <Button key="list-loadmore-delete" style={{ color: 'red' }}
                                    onClick={() => {
                                        showDeleteFriendSender({receiverId: item.receiver.id, friendName: item.receiver.firstName +' '+ item.receiver.lastName})
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />&nbsp;Delete
                                </Button>
                            ]}
                            style={{ borderBottom: '1px solid #dadada' }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={
                                    `${item.receiver.avatar ? process.env.REACT_APP_API_URL+'/'+item.receiver.avatar : 'images/default-avatar.png'}`
                                } />}
                                title={`${item.receiver.firstName} ${item.receiver.lastName}`}
                                description={
                                    `Became friends on ${new Date(item.updatedAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })}`
                                }
                            />
                        </List.Item>
                    ))}
                </TabPane>

                <TabPane 
                    tab={`Request received`}
                    key={'2'} 
                    style={{ padding: '15px'}}
                >
                    {requests && [...requests].map((item, index) => (
                        (item.status === 0 && item.receiveId === user.id) && (
                            <List.Item
                                actions={[
                                    <Button key="list-loadmore-delete" style={{ color: 'green' }}
                                        onClick={() => {
                                            acceptFriend(item.senderId)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faUserCheck} />&nbsp;Accept
                                    </Button>,
                                    <Button key="list-loadmore-delete" style={{ color: 'red' }}
                                        onClick={() => {
                                            rejectFriend(item.senderId)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />&nbsp;Reject
                                    </Button>
                                ]}
                                style={{ borderBottom: '1px solid #dadada' }}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={
                                        `${item.sender.avatar ? process.env.REACT_APP_API_URL+'/'+item.sender.avatar : 'images/default-avatar.png'}`
                                    } />}
                                    title={`${item.sender.firstName} ${item.sender.lastName}`}
                                    description={
                                        `Received at ${new Date(item.createdAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })}`
                                    }
                                />
                            </List.Item>
                        )
                    ))}
                </TabPane>

                <TabPane 
                    tab={`Request sent`}
                    key={'3'} 
                    style={{ padding: '15px'}}
                >
                    {requests && [...requests].map((item, index) => (
                        (item.status === 0 && item.senderId === user.id) && (
                            <List.Item
                                actions={[
                                    <Button key="list-loadmore-delete" style={{ color: 'red' }}
                                        onClick={() => {
                                            deleteFriendRequest(item.receiveId)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />&nbsp;Delete
                                    </Button>
                                ]}
                                style={{ borderBottom: '1px solid #dadada' }}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={
                                        `${item.receiver.avatar ? process.env.REACT_APP_API_URL+'/'+item.receiver.avatar : 'images/default-avatar.png'}`
                                    } />}
                                    title={`${item.receiver.firstName} ${item.receiver.lastName}`}
                                    description={
                                        `Sent at ${new Date(item.createdAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })}`
                                    }
                                />
                            </List.Item>
                        )
                    ))}
                </TabPane>

                <TabPane 
                    tab={`Add friends`}
                    key={'4'} 
                    style={{ padding: '15px'}}
                >
                    <Space direction="vertical" style={{ marginBottom: '20px' }}>
                        <Search placeholder="Search name" onSearch={onSearch} enterButton />
                    </Space>
                    {notFriends && [...notFriends].map((item) => (
                        (item.id !== user.id) &&
                        <List.Item
                            actions={[
                                <Button key="list-loadmore-delete" style={{ color: '#1890ff' }}
                                    onClick={() => {
                                        addFriend({userId: item.id})
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserPlus} />&nbsp;Add friend
                                </Button>
                            ]}
                            style={{ borderBottom: '1px solid #dadada' }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={
                                        `${item.avatar ? process.env.REACT_APP_API_URL+'/'+item.avatar : 'images/default-avatar.png'}`
                                    } />
                                }
                                title={`${item.firstName} ${item.lastName}`}
                                description={item.email}
                            />
                        </List.Item>
                    ))}
                </TabPane>
            </Tabs>
        </Content>
    </Layout>
    )
};

export default Contact;
