const groupRepo = require("../repositories/GroupRepository")
const messRepo = require("../repositories/MessageRepository")

class MessageService {

    async createMessageTextEmoji({ groupId, userId, type, content }) {
        const checkUser = await groupRepo.findAMemberById({ userId, groupId })
        if (!checkUser) {
            return {
                status: 400,
                error: 0,
                message: 'user_is_not_in_group',
                data: null
            }
        }

        const createMessage = await messRepo.createMessage({ groupId, userId, type, content })
        const newMessage = await messRepo.getById({ id: createMessage.id })

        // update last message in group_members table
        const groupMembers = await groupRepo.findAllMember({ groupId: newMessage.groupchatId })
        groupMembers.forEach((member) => {
            member.update({
                lastMessageId: newMessage.id,
                lastMessageTimestamp: newMessage.createdAt,
            })
        })

        return {
            status: 200,
            error: 0,
            message: 'send_message_success',
            data: newMessage
        }
    }

    async createMessageImage({ groupId, userId, image }) {
        if(!image) {
            return {
                status: 400,
                error: 1,
                message: 'image_required',
                data: null
            }
        }
            
        const checkUser = await groupRepo.findAMemberById({ userId, groupId })
        if (!checkUser) {
            return {
                status: 400,
                error: 0,
                message: 'user_is_not_in_group',
                data: null
            }
        }

        const message = await messRepo.createMessage({ 
            groupId, 
            userId, 
            type: 'image', 
            content: `/static/assets/uploads/messages/${image.filename}`
        })

        const newMessage = await messRepo.getById({ id: message.id })

        // update last message in group_members table
        const groupMembers = await groupRepo.findAllMember({ groupId: newMessage.groupchatId })
        groupMembers.forEach((member) => {
            member.update({
                lastMessageId: newMessage.id,
                lastMessageTimestamp: newMessage.createdAt,
            })
        })

        return {
            status: 200,
            error: 0,
            message: 'send_message_success',
            data: newMessage
        }
    }

    async getAllMessageByGroup({ groupId, userId }) {
        const checkUser = await groupRepo.findAMemberById({ userId, groupId })
        if (!checkUser) {
            return {
                status: 400,
                error: 0,
                message: 'user_is_not_in_group',
                data: null
            }
        }

        const group = await groupRepo.findById({ groupId })
        const messages = await messRepo.getAllByGroup({ groupId })

        return {
            status: 200,
            error: 0,
            message: 'get_all_messages_success',
            data: {
                group,
                messages
            }
        }
    }
}

module.exports = new MessageService();
