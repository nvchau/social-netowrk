import React, { useEffect, useState, useRef } from "react";
import './index.css';
import { Layout, Tabs, Button, Modal, List, Avatar, Input, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane, faImage, faGrinAlt, faTimesCircle, faUserCheck, faUsers, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import authApi from "../../api/authApi";
import groupChatApi from "../../api/groupChatApi";
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import messageApi from "../../api/messageApi";
import friendApi from "../../api/friendApi";
import Picker from 'emoji-picker-react';
import Notifier from "react-desktop-notification";
import socket from '../../helpers/socketio';

const { Content } = Layout;
const { TabPane } = Tabs;

const Home = (props) => {
  const history = useHistory()
  const { token, user, pushNotification } = props;

  // Auto scroll to bottom of chat box
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) //{ behavior: "smooth" }
  }

  const [chatList, setChatList] = useState([])

  const fetchChatList = async () => {
    const response = await groupChatApi.getAllGroupByUser(token)
    setChatList(response.data)
  }

  useEffect(() => {
    // Get all group (private and group)
    (async () => {
      await fetchChatList()

      setTimeout(() => {
        scrollToBottom()
      }, 500)
    })()
  }, [])

  useEffect(() => {
    // Scroll to bottom when have new message
    scrollToBottom()
  }, [chatList])

  useEffect(() => {
    socket.emit('addUser', user && user.id)

    // Join all group of user
    chatList && chatList.map((group) => {
      socket.emit('joinGroup', { 
        userId: user?.id, 
        groupId: group.GroupChat.id, 
        groupName: group.GroupChat.name 
      })
    })
  }, [chatList])

  // Text Message
  const [textMessage, setTextMessage] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupName, setGroupName] = useState('')

  const changeTextMessage = (evt) => {
    setTextMessage(evt.target.value)
    setGroupId(evt.groupId)
    setGroupName(evt.groupName)
  }

  // Emoji Message
  const [showEmojiBox, setShowEmojiBox] = useState(false)

  const onEmojiClick = (event, emojiObject) => {
    setTextMessage(`${textMessage}${emojiObject.emoji}`)
  }

  const toggleShowEmojiPicker = () => {
    setShowEmojiBox(!showEmojiBox)
  }

  // Image Message
  const [image, setImage] = useState(null)
  const [imgData, setImgData] = useState(null)

  const [showImageBox, setShowImageBox] = useState(false)

  const toggleShowImageBox = () => {
    setShowImageBox(!showImageBox)
    setImage(null)
  }

  // show image when choose
  const onChangeImage = (evt) => {
    if (evt.target.files[0]) {
      // console.log({image: evt.target.files[0]})
      setGroupId(evt.groupId)
      setGroupName(evt.groupName)
      
      setImage(evt.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgData(reader.result)
      })
      reader.readAsDataURL(evt.target.files[0])
      setShowImageBox(true)
    }
  }

  const sendMessage = async () => {
    // image
    if (image) {
      // console.log({image})
      const newMessage = await messageApi.sendImage({token, groupId: parseInt(groupId), image})
      console.log({newMessage})

      // call socket
      await socket.emit('sendMessage', {
        groupId, 
        groupName,
        message: newMessage.data
      })

      setShowImageBox(false)
      setImage(null)
    }

    // text and emoji
    if ((textMessage && textMessage.trim())){
      // call api to send message
      const newMessage = await messageApi.sendTextEmoji({token, groupId: parseInt(groupId), type: 'text', content: textMessage})

      // call socket
      await socket.emit('sendMessage', {
        groupId, 
        groupName,
        message: newMessage.data
      })

      // reset field
      setTextMessage('')
      setGroupId('')
      setGroupName('')
    }
  }

  // receive message from socket
  useEffect(() => {
    socket.on('getMessage', async (message) => {
      await fetchChatList()
      // console.log({message})

      // only show with other people (not sender)
      if (user?.id !== message.User?.id) {
        // Show new message notification in group list
        const groupItem = document.getElementById(`group-id-${message.groupchatId}`)
        if (groupItem) {
          groupItem.setAttribute('class', 'span-new-message')
        }

        let notiPush = new Object()
        notiPush.title = `${message.User.firstName} ${message.User.lastName}`
        notiPush.content = `${message.type === 'image' ? 'Send a photo' : message.content}`
        notiPush.url = `http://localhost:3001/`
        notiPush.image = `${message.User.avatar ? process.env.REACT_APP_API_URL+'/'+message.User.avatar : 'images/default-avatar.png'}`

        // push notification new message - to App.jsx
        pushNotification(notiPush)
        
        // Push notification new message
        // Notifier.start(
        //   `${message.User.firstName} ${message.User.lastName}`, // title
        //   `${message.type === 'image' ? 'Send a photo' : message.content}`, // content
        //   `http://localhost:3001/`, // url will open when click on notification
        //   `${message.User.avatar ? process.env.REACT_APP_API_URL+'/'+message.User.avatar : 'images/default-avatar.png'}` // image
        // )
      }
    })
  }, [])
  

  const [friendList, setFriendList] = useState()
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


  // Modal create new group
  let [memberIdList, setMemberList] = useState([])
  let [memberNameList, setMemberNameList] = useState([])
  const [newGroupName, setNewGroupName] = useState()

  const onChangeNewGroupName = (evt) => {
    setNewGroupName(evt.target.value)
  }

  const addMember = ({memberId, memberName}) => {
    // console.log({memberId, memberName})
    memberIdList = [...memberIdList, memberId]
    // remove duplicate item
    memberIdList = memberIdList.filter(function (value, index, array) { 
      return array.indexOf(value) === index;
    })
    setMemberList(memberIdList)
    memberNameList = [...memberNameList, memberName]
    memberNameList = memberNameList.filter(function (value, index, array) { 
      return array.indexOf(value) === index;
    })
    setMemberNameList(memberNameList)
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true)
  }

  // Create new group chat
  const handleOk = async () => {
    if (memberIdList.length < 2) {
      toast.error(`Must have at least 2 members`)
      return false
    }

    if ((newGroupName && newGroupName.trim())) {
      const newGroup = await groupChatApi.createGroup({token, name: newGroupName, members: memberIdList})
      // console.log({newGroup})

      if (newGroup.status === 201) {
        socket.emit('createNewGroup', newGroup.data)
        setIsModalVisible(false)

        toast.success(`Create group "${newGroup.data.group.name}" success`)

        await fetchChatList()

        return false
      } else {
        toast.error(`${newGroup.message}`)

        return false
      }
    } else {
      toast.error(`Please enter the group name`)

      return false
    }
  }
  const handleCancel = () => {
    setMemberList([])
    setMemberNameList([])
    setNewGroupName('')
    setIsModalVisible(false)
  }

  // listen event: create new group
  useEffect(() => {
    socket.on('getNewGroup', async newGroup => {
      newGroup.members && [...newGroup.members].map(async (member) => {
        if (user && member.userId === user.id) {
          await fetchChatList()
          // console.log({newGroup})

          let notiPush = new Object()
          notiPush.title = `You have just been added to group ${newGroup.group.name}`
          notiPush.content = `Added at ${new Date(newGroup.group.createdAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })}`
          notiPush.url = `http://localhost:3001/`
          notiPush.image = `images/group-chat.png`

          pushNotification(notiPush)
        }
      })
    })
  }, [])

  const clickToHideNewMessNoti = (elementId) => {
    const element = document.getElementById(elementId)
    element.removeAttribute('class', 'span-new-message')
  }

  // Delete group by Author
  const [isOpenModalDeleteGroup, setOpenModalDeleteGroup] = useState(false)
  const toglleDeleteGroupModal = () => {
    setOpenModalDeleteGroup(!isOpenModalDeleteGroup)
  }

  const deleteGroup = async ({groupId}) => {
    const deleteGroupReq = await groupChatApi.deleteGroup({token, groupId})

    if (deleteGroupReq.status === 200) {
      toast.success(`Delete group successfully`)
      socket.emit('deleteGroup', ({groupId}))
      await fetchChatList()
    } else {
      toast.error(`An error occurred, please try again`)
    }
  }

  useEffect(() => {
    socket.on('getDeleteGroup', async ({groupId}) => {
      await fetchChatList()
    })
  }, [])

  const { confirm } = Modal;
  const showDeleteGroupConfirm = ({groupId, groupName}) => {
    confirm({
      title: `Are you sure delete ${groupName}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Please consider carefully',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteGroup({groupId})
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const [defaultTabActive, setDefaultTabActive] = useState('')

  if(token){
  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: 15 }}>
        <Button type="primary" className="new-message" style={{ width: '100%' }}
          onClick={showModal}
        >
          <FontAwesomeIcon icon={faEnvelope} />	&nbsp; New Group Chat 
        </Button>

        {chatList.length > 0 && (
        <Tabs defaultActiveKey={defaultTabActive} tabPosition={'left'} style={{ height: 785 }} width='250px' >
          {chatList && [...chatList].map((item, index) => (
            <TabPane
              key={`tab-${item.GroupChat.id}`} 
              style={{ padding: '15px'}}
              
              tab={
                <span
                  onClick={() => {
                    clickToHideNewMessNoti(`group-id-${item.GroupChat.id}`)
                    setDefaultTabActive(`tab-${item.GroupChat.id}`)
                  }}
                >
                  {item.GroupChat.GroupMembers.length === 2 ?
                    <>
                      {[...item.GroupChat.GroupMembers].map(member => (
                        user && user.id !== member.User.id ?
                        <>
                          <img className="img-circle medium-image" src={
                              `${member.User.avatar ? process.env.REACT_APP_API_URL+'/'+member.User.avatar : 'images/default-avatar.png'}`
                            } alt=""></img>
                          <span>
                            {`${member.User.firstName} ${member.User.lastName}`}
                            <p style={{ color: 'gray', position: 'absolute', top: 35, left: 74 }}>
                              {item.last_message?.content && 
                                item.last_message?.type === 'image' ?
                                'Image' : 
                                item.last_message?.content.length > 16 ?
                                item.last_message?.content.substring(0, 16)+'...' :
                                item.last_message?.content
                              }
                            </p>
                          </span>
                          <span id={`group-id-${item.GroupChat.id}`} className=""></span>
                        </>
                        :
                        <></>
                      ))}
                    </>
                    :
                    <>
                      <img className="img-circle medium-image" src="/images/group-chat.png" alt=""></img>
                      <span>{item.GroupChat.name}</span>
                      <p style={{ color: 'gray', position: 'absolute', top: 35, left: 74 }}>
                        {item.last_message?.content && 
                          item.last_message?.type === 'image' ?
                          'Image' : 
                          item.last_message?.content.length > 16 ?
                          item.last_message?.content.substring(0, 16)+'...' :
                          item.last_message?.content
                        }
                      </p>
                      <span id={`group-id-${item.GroupChat.id}`} className=""></span>
                    </>
                  }
                </span>
              }
            >
              <div className="message-chat"
                onClick={() => {
                  clickToHideNewMessNoti(`group-id-${item.GroupChat.id}`)
                }}
              >
                {/* function for group */}
                <div style={{ float: 'right' }}>
                  {item.GroupChat.GroupMembers.length > 2 &&
                    <>
                      {/* <Button type="info" style={{ color: '#1890ff' }}
                        onClick={() => {
                          showMemberModal()
                        }}
                      ><FontAwesomeIcon icon={faUsers} /></Button>&nbsp;&nbsp; */}
                      {item.GroupChat.author === user?.id &&
                        <>
                          {/* <Button type="info" style={{ color: 'green' }}><FontAwesomeIcon icon={faUserPlus} /></Button>&nbsp;&nbsp; */}
                          <Button type="info" style={{ color: 'red' }}
                            onClick={() => {
                              showDeleteGroupConfirm({groupId: item.GroupChat.id, groupName: item.GroupChat.name})
                            }}
                          ><FontAwesomeIcon icon={faTrashAlt} /></Button>
                        </>
                      }
                    </>
                  }
                </div>

                <div className="chat-body">
                  {item.GroupChat.Messages && item.GroupChat.Messages.map(message => (
                    <>
                      {(user && user.id === message.senderId) ?
                        <div className="message my-message">
                          <img alt="" className="img-circle medium-image" src={
                            `${user.avatar ? process.env.REACT_APP_API_URL+'/'+user.avatar : 'images/default-avatar.png'}`
                          } />

                          <div className="message-body">
                            <div className="message-body-inner">
                              <div className="message-info">
                                <h4> You </h4>
                                <h5> <i className="fa fa-clock-o"></i> {new Date(message.createdAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })} </h5>
                              </div>
                              <hr />
                              <div className="message-text">
                                {message.type === 'text' && message.content}
                                {message.type === 'image' &&
                                  <div style={{ textAlign: 'center' }}>
                                    <img src={`${process.env.REACT_APP_API_URL}/${message.content}`} alt="" className="message-img" />
                                  </div>
                                }
                                {message.type === 'emoji' && message.content}
                              </div>
                            </div>
                          </div>
                          <br />
                        </div>
                        :
                        <div className="message success">
                          <img alt="" className="img-circle medium-image" src={
                            `${message.User.avatar ? process.env.REACT_APP_API_URL+'/'+message.User.avatar : 'images/default-avatar.png'}`
                            } />

                          <div className="message-body">
                            <div className="message-info">
                              <h4> {message.User.firstName} {message.User.lastName}</h4>
                              <h5> <i className="fa fa-clock-o"></i> {new Date(message.createdAt).toLocaleString("vi", { timeZone: "Asia/ho_chi_minh" })} </h5>
                            </div>
                            <hr />
                            <div className="message-text">
                                {message.type === 'text' && message.content}
                                {message.type === 'image' &&
                                  <div style={{ textAlign: 'center' }}>
                                    <img src={`${process.env.REACT_APP_API_URL}/${message.content}`} alt="" className="message-img" />
                                  </div>
                                }
                                {message.type === 'emoji' && message.content}
                            </div>
                          </div>
                          <br />
                        </div>
                      }
                    </>
                  ))}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Typing text and emoji input */}
                <div className="chat-footer">
                  <input className="send-message-text"
                    onChange={(evt) => {
                      // add group info to evt variable
                      evt.groupId = item.GroupChat.id
                      evt.groupName = item.GroupChat.name
                      changeTextMessage(evt)
                    }}
                    value={textMessage}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        sendMessage()
                      }
                    }}
                  ></input>

                  {/* Choose image button */}
                  <label className="upload-file">
                    <input type="file" required=""
                      onChange={(evt) => {
                        evt.groupId = item.GroupChat.id
                        evt.groupName = item.GroupChat.name
                        onChangeImage(evt)
                      }}
                    />
                    <FontAwesomeIcon icon={faImage} />
                  </label>

                  {/* Show emoji picker button */}
                  <label className="emoji-picker-popup">
                    <span className="emoji-span" required="" />
                    <FontAwesomeIcon icon={faGrinAlt} 
                      onClick={() => {
                        toggleShowEmojiPicker()
                      }}
                    />
                  </label>

                  {/* Send message button */}
                  <Button type="primary" className="send-message-button" id="btn-send-message"
                    onClick={() => {
                      sendMessage()
                    }}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </Button>

                  {/* Emoji picker */}
                  <div>
                    {showEmojiBox ? (
                      <Picker onEmojiClick={onEmojiClick} />
                    ) : ( '' )}
                  </div>

                  {/* Image show box */}
                  <div>
                    {showImageBox ? (
                      <span className="image-message">
                        <img src={imgData} alt="" />
                        <Button className="btn-close-image-box" 
                          onClick={() => {
                            toggleShowImageBox()
                          }}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </Button>
                      </span>
                    ) : ( <span></span> )}
                  </div>
                </div>
              </div>
            </TabPane>
          ))}
        </Tabs>
        )}
      </Content>

      {/* Create new group */}
      <Modal title="Create new group" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="Group name" onChange={(evt) => {
          onChangeNewGroupName(evt)
        }} required />

        <h4 style={{ marginTop: 10 }}>Added: &nbsp;
          {[...memberNameList].map(member => (
            `${member}, `
          ))}
        </h4>

        {friendList && [...friendList].map((item, index) => (
          (user && item.receiver.id === user.id) ?
          <List.Item
            actions={[
              <Button key="list-loadmore-delete" style={{ color: 'green' }}
                onClick={() => {
                  addMember({memberId: item.sender.id, memberName: `${item.sender.firstName} ${item.sender.lastName}`})
                }}
              >
                <FontAwesomeIcon icon={faUserCheck} />&nbsp;Add
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
          </List.Item> : <span></span>
        ))}

        {friendList && [...friendList].map((item, index) => (
          (user && item.sender.id === user.id) ?
          <List.Item
            actions={[
              <Button key="list-loadmore-delete" style={{ color: 'green' }}
                onClick={() => {
                  addMember({memberId: item.receiver.id, memberName: `${item.receiver.firstName} ${item.receiver.lastName}`})
                }}
              >
                <FontAwesomeIcon icon={faUserCheck} />&nbsp;Add
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
          </List.Item> : <span></span>
        ))}
      </Modal>
    </Layout>
  )
  } else {
    return (
      <div style={{ minHeight: '480px' }}>
        <center style={{ marginTop: '350px'}}>
          <h1>
            <a href = '/login' style={{ border: '2px solid', padding: '10px', borderRadius: '5px'}}> Login now</a>
          </h1>
        </center>
      </div>
    )
  }
};

export default Home;
