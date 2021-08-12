const messageService = require("../services/MessageService")

class MessageController {

    async sendMessageTextEmoji(req, res, next) {
        const { groupId } = req.params 
        const { type, content } = req.body
        const user = req.payload

        const response = await messageService.createMessageTextEmoji({ groupId: parseInt(groupId), userId: user.id, type, content })

        return res.status(200).json(response)
    }

    async sendMessageImage(req, res, next) {
        const { groupId } = req.params
        const user = req.payload
        const image = req.file

        const response = await messageService.createMessageImage({ 
            groupId: parseInt(groupId), 
            userId: user.id, 
            image
        })

        return res.status(200).json(response)
    }

    async getAllMessageByGroup(req, res, next) {
        const { groupId } = req.params
        const user = req.payload

        const response = await messageService.getAllMessageByGroup({ groupId: parseInt(groupId), userId: user.id })

        return res.status(200).json(response)
    }
}

module.exports = new MessageController();
