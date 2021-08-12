const groupService = require("../services/GroupService")

class GroupController {

    async createGroup(req, res, next) {
        const { name, members } = req.body
        const author = req.payload

        const response = await groupService.createGroup({ name, authorId: author.id, members })

        return res.status(200).json(response)
    }

    async createGroupPrivate(req, res, next) {
        const { userId } = req.params
        const author = req.payload

        const response = await groupService.createGroupPrivate({ authorId: author.id, member: parseInt(userId) })

        return res.status(response.status).json(response)
    }

    async getAllByUser(req, res, next) {
        const user = req.payload
        
        const response = await groupService.getAllByUser({ userId: user.id })

        return res.status(200).json(response)
    }

    async addMember(req, res, next) {
        const { groupId, userId } = req.params
        const author = req.payload

        const response = await groupService.addMember({ 
            authorId: author.id, 
            userId: parseInt(userId), 
            groupId: parseInt(groupId)
        })

        return res.status(200).json(response)
    }

    async deleteMember(req, res, next) {
        const { groupId, userId } = req.params
        const author = req.payload

        const response = await groupService.deleteMember({ 
            authorId: author.id, 
            userId: parseInt(userId), 
            groupId: parseInt(groupId) 
        })

        return res.status(200).json(response)
    }

    async deleteGroup(req, res, next) {
        const { groupId } = req.params
        const author = req.payload

        const response = await groupService.deleteGroup({ 
            authorId: author.id, 
            groupId: parseInt(groupId) 
        })

        return res.status(200).json(response)
    }
}

module.exports = new GroupController();
