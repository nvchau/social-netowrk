let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && userId !== undefined &&
    users.push({
        userId,
        socketId
    })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

const serverSocket = (socket, io) => {
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id)
        // io.emit('getUsers', users)
        // console.log(users)
    })

    // GROUP
    socket.on('joinGroup', async ({userId, groupId, groupName}) => {
        // socket id will be automatically added to the room
        socket.join(`${groupId}-${groupName}`) // ${groupId}-${groupName} is the room name

        // show all room
        console.log({allRooms: io.sockets.adapter.rooms})
    })

    socket.on('createNewGroup', (newGroup) => {
        io.emit('getNewGroup', newGroup)
    })

    socket.on('sendMessage', ({groupId, groupName, message}) => {
        io.to(`${groupId}-${groupName}`).emit('getMessage', message)
    })

    // FRIEND REQUEST
    socket.on('addFriend', ({senderId, receiverId, newRequest}) => {
        // console.log({senderId, receiverId})
        // const receiver = getUser(receiverId)
        // console.log({receiver})
        // io.to(receiver.socketId).emit('addFriendRequest', newRequest)
        io.emit('addFriendRequest', newRequest)
    })

    // ACCEPT FRIEND
    socket.on('acceptFriend', ({senderId, receiverId, acceptRequest}) => {
        io.emit('acceptFriendRequest', acceptRequest)
    })

    // REJECT
    socket.on('rejectFriend', ({receiverId, senderId, rejectRequest}) => {
        io.emit('rejectFriendRequest', {receiverId, senderId, rejectRequest})
    })

    // DELETE FRIEND REQUEST (BY SENDER)
    socket.on('deleteFriendRequest', ({senderId, receiverId, deleteRequest}) => {
        io.emit('getDeleteFriendRequest', {senderId, receiverId, deleteRequest})
    })

    // DELETE FRIEND BY SENDER
    socket.on('deleteFriendBySender', ({senderId, receiverId, deleteRequest}) => {
        io.emit('getDeleteFriendBySender', {senderId, receiverId, deleteRequest})
    })

    // DELETE FRIEND BY RECEIVER
    socket.on('deleteFriendByReceiver', ({senderId, receiverId, deleteRequest}) => {
        io.emit('getDeleteFriendByReceiver', {senderId, receiverId, deleteRequest})
    })

    // DELETE GROUP BY AUTHOR
    socket.on('deleteGroup', ({groupId}) => {
        io.emit('getDeleteGroup', {groupId})
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)
    })
}
module.exports = serverSocket
