const db = require("../models");

class MessageRepository {
    async createMessage({ groupId, userId, type, content }) {
        const newGroup = await db.Message.create({ 
            groupchatId: groupId,
            senderId: userId,
            type: type,
            content: content
        })

        return newGroup
    }

    async getAllByGroup({ groupId }) {
        const messages = await db.Message.findAll({
            required: true,
            where: {
                groupchatId: groupId
            }
        })

        return messages
    }

    async getById({ id }) {
        const message = await db.Message.findOne({
            required: true,
            where: {
                id: id
            },
            include: [
                {
                    model: db.User,
                    required: true,
                    attributes: { exclude: ['password'] },
                }
            ]
        })

        return message
    }
}

module.exports = new MessageRepository();
