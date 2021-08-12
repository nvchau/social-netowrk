const express = require("express")
const router = express.Router()
const verifyToken = require("../src/middlewares/verifyToken")
const groupController = require("../src/controllers/GroupController")
const createGroupValidator = require("../src/validators/groups/createGroupValidator")
const createGroupPrivateValidator = require("../src/validators/groups/createGroupPrivateValidator.js")
const addMemberValidator = require("../src/validators/groups/addMemberValidator")
const deleteMemberValidator = require("../src/validators/groups/addMemberValidator")
const validatorHelper = require("../src/helpers/validatorHelper")
const messageController = require("../src/controllers/MessageController")
const sendMessageValidator = require("../src/validators/messages/sendMessageValidator")
const uploadImage = require("../src/helpers/uploadImage")

router.use(verifyToken)
router.post('/', createGroupValidator, validatorHelper, groupController.createGroup)
router.post('/private/:userId', createGroupPrivateValidator, validatorHelper, groupController.createGroupPrivate)
router.get('/', groupController.getAllByUser)
router.delete('/:groupId', groupController.deleteGroup)
router.post('/:groupId/members/:userId', addMemberValidator, validatorHelper, groupController.addMember)
router.delete('/:groupId/members/:userId', deleteMemberValidator, validatorHelper, groupController.deleteMember)

router.post('/:groupId/messages/text-emoji', sendMessageValidator, validatorHelper, messageController.sendMessageTextEmoji)
router.post('/:groupId/messages/image',
    uploadImage.uploadFile({ savePath: 'messages', uploadName: 'image' }),
    messageController.sendMessageImage
)
router.get('/:groupId/messages', messageController.getAllMessageByGroup)

module.exports = router
