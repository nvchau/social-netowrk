const FriendService = require('../services/FriendService')

class FriendController {

    async getListFriend(req, res) {
        const userId = req.payload.id;
        const response = await FriendService.getListFriend({ userId });
        return res.status(200).json(response)
    }
    
    async getAllFriendRequest(req, res) {
        const userId = req.payload.id;
        const response = await FriendService.getAllFriendRequest({ userId });
        return res.status(200).json(response)
    }

    async getAllUser(req, res) {
        const response = await FriendService.getAllUser();
        return res.status(200).json(response)
    }

    async makeRequest(req, res) {
        try {
            const { receive_id } = req.params
            const sender_id = req.payload.id
            const response = await FriendService.sendReq({ sender_id, receive_id })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }

    async acceptRequest(req, res) {
        try {
            const { sender_id } = req.params
            const receive_id = req.payload.id
            const response = await FriendService.acceptReq({ sender_id, receive_id })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }

    async deleteRequest(req, res) {
        try {
            const { receive_id } = req.params
            const sender_id = req.payload.id
            const response = await FriendService.deleteRequest({ sender_id, receive_id })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }
    async deleteRequestByReceiver(req, res) {
        try {
            const { sender_id } = req.params
            const receive_id = req.payload.id
            const response = await FriendService.deleteRequest({ sender_id, receive_id })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }

    async deleteFriendBySender(req, res) {
        try {
            const { receive_id } = req.params
            const sender_id = req.payload.id
            const response = await FriendService.deleteFriend({ sender_id, receive_id })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }

    async deleteFriendByReceiver(req, res) {
        try {
            const { sender_id } = req.params
            const receive_id = req.payload.id
            const response = await FriendService.deleteFriend({ sender_id, receive_id })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }
}
module.exports = new FriendController()