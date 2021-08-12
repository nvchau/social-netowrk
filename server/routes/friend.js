const express = require("express");
const router = express.Router()
const FriendController = require('../src/controllers/FriendController')
const verifyToken = require('../src/middlewares/verifyToken')
const senderIdValidator = require('../src/validators/friends/senderIdValidator')
const receiverIdValidator = require('../src/validators/friends/receiveIdvalidator')
const validationResult = require('../src/helpers/validatorHelper')

router.get('/users', FriendController.getAllUser)
router.use(verifyToken)
router.get('/', FriendController.getListFriend)
router.get('/requests', FriendController.getAllFriendRequest)
router.post('/request/:receive_id', receiverIdValidator, validationResult, FriendController.makeRequest)
router.post('/accept/:sender_id', senderIdValidator, validationResult, FriendController.acceptRequest)
router.delete('/delete_req_sender/:receive_id', receiverIdValidator, validationResult, FriendController.deleteRequest)
router.delete('/delete_req_receiver/:sender_id', senderIdValidator, validationResult, FriendController.deleteRequestByReceiver)
router.delete('/delete_friend_sender/:receive_id', receiverIdValidator, validationResult, FriendController.deleteFriendBySender)
router.delete('/delete_friend_receiver/:sender_id', senderIdValidator, validationResult,FriendController.deleteFriendByReceiver)

module.exports = router
