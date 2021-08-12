const db = require("../models")
const { Op } = require("sequelize");
class FriendRepository {


    async getListFriend({ userId }) {
        return await db.Friend.findAll({
            where: {
                status: 1,
                [Op.or]: [
                    { senderId: userId },
                    { receiveId: userId }
                ]
            },
            include: [
                {
                    model: db.User,
                    as: 'sender',
                    required: true,
                    attributes: { exclude: ['password'] },
                },
                {
                    model: db.User,
                    as: 'receiver',
                    required: true,
                    attributes: { exclude: ['password'] },
                },
            ],
        })
    }

    async getAllFriendRequest({ userId }) {
        return await db.Friend.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiveId: userId }
                ]
            },
            include: [
                {
                    model: db.User,
                    as: 'sender',
                    required: true,
                    attributes: { exclude: ['password'] },
                },
                {
                    model: db.User,
                    as: 'receiver',
                    required: true,
                    attributes: { exclude: ['password'] },
                },
            ],
        })
    }

    async getAllUser() {
        return await db.User.findAll()
    }

    async findById({ id }) {
        const friend_request = await db.Friend.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: db.User,
                    as: 'sender',
                    required: true,
                    attributes: { exclude: ['password'] },
                },
                {
                    model: db.User,
                    as: 'receiver',
                    required: true,
                    attributes: { exclude: ['password'] },
                },
            ],
        })
        return friend_request
    }

    async findFriendRequest({ sender_id, receive_id }) {
        const friend_request = await db.Friend.findOne({
            where: {
                senderId: sender_id,
                receiveId: receive_id
            }
        })
        return friend_request
    }
    async sendRequest({ sender_id, receive_id }) {
        const insert_request = await db.Friend.create({
            senderId: sender_id,
            receiveId: receive_id,
            status: 0
        })
        return insert_request
    }

    async acceptRequest({ sender_id, receive_id }) {
        const accept = await db.Friend.update({ status: 1 }, {
            where: {
                senderId: sender_id,
                receiveId: receive_id
            }
        })
        return accept
    }

    async deleteRequest({ sender_id, receive_id }) {
        const deleteReq = await db.Friend.destroy({
            where: {
                sender_id,
                receive_id,
                status: 0
            }
        })
        return deleteReq
    }
    async deleteFriend({ sender_id, receive_id }) {
        const deleteFriend = await db.Friend.destroy({
            where: {
                senderId: sender_id,
                receiveId: receive_id,
                status: 1
            }
        })

        return deleteFriend
    }
}
module.exports = new FriendRepository()