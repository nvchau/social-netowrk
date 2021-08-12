const FriendRepository = require('../repositories/FriendRepository')
const GroupService = require('../services/GroupService')
const groupRepo = require("../repositories/GroupRepository")

class FriendService {

    async getListFriend({ userId }) {
        const friends = await FriendRepository.getListFriend({ userId });
        console.log({ friends });
        if (!friends)
            return {
                status: 404,
                error: 1,
                message: 'friend_not_found',
                data: null
            }
        return {
            status: 200,
            error: 0,
            message: 'list_friend',
            data: friends
        }

    }

    async getAllFriendRequest({ userId }) {
        const requests = await FriendRepository.getAllFriendRequest({ userId });

        return {
            status: 200,
            error: 0,
            message: 'get_all_request_success',
            data: requests
        }
    }

    async getAllUser() {
        const requests = await FriendRepository.getAllUser();

        return {
            status: 200,
            error: 0,
            message: 'get_all_user_are_not_friend_success',
            data: requests
        }
    }

    async sendReq({ sender_id, receive_id }) {
        const friend_request = await FriendRepository.findFriendRequest({ sender_id, receive_id })
        if (friend_request) {
            return {
                status: 400,
                error: 1,
                message: 'you_requested',
                data: null
            }
        }

        if (sender_id === Number(receive_id)) {
            return {
                status: 400,
                error: 1,
                message: 'request_yourself',
                data: null
            }
        }
        const insert_req = await FriendRepository.sendRequest({ sender_id, receive_id })
        
        if (!insert_req) {
            return {
                status: 400,
                error: 1,
                message: 'request_fail',
                data: null
            }
        }

        const new_request = await FriendRepository.findById({ id: insert_req.id })
        
        return {
            status: 200,
            error: 0,
            message: 'request_success',
            data: new_request
        }
    }

    async acceptReq({ sender_id, receive_id }) {
        const fr_rq = await FriendRepository.findFriendRequest({ sender_id, receive_id })
        if (!fr_rq) {
            return {
                status: 400,
                error: 1,
                message: 'only_receiver_accept',
                data: null
            }
        }
        const accept = await FriendRepository.acceptRequest({ sender_id, receive_id })
        if (!accept) {
            return {
                status: 400,
                error: 1,
                message: 'accept_request_fail',
                data: null
            }
        }
        const result = await GroupService.createGroupPrivate({
            authorId: sender_id,
            member: receive_id
        })

        const accept_request = await FriendRepository.findById({ id: fr_rq.id })

        return {
            status: 200,
            error: 0,
            message: 'accept_success',
            data: accept_request
        }
    }

    async deleteRequest({ sender_id, receive_id }) {
        const deleteReq = await FriendRepository.deleteRequest({ sender_id, receive_id })
        if (!deleteReq) {
            return {
                status: 400,
                error: 1,
                message: 'have_no_request',
                data: null
            }
        }
        return {
            status: 200,
            error: 0,
            message: 'delete_request_success',
            data: deleteReq
        }
    }

    async deleteFriend({ sender_id, receive_id }) {
        const deleteFriend = await FriendRepository.deleteFriend({ sender_id, receive_id })
        if (!deleteFriend) {
            return {
                status: 400,
                error: 1,
                message: 'delete_friend_fail',
                data: null
            }
        }

        const group = await groupRepo.findByNameId({senderId: sender_id, receiverId: receive_id})
        await groupRepo.deleteGroup({ groupId: group.id })
        await groupRepo.deleteAllMemberByGroup({ groupId: group.id })
        await groupRepo.deleteAllMessageByGroup({ groupId: group.id })

        return {
            status: 200,
            error: 0,
            message: 'delete_friend_success',
            data: deleteFriend
        }
    }
}

module.exports = new FriendService()