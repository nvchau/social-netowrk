const userRepo = require("../repositories/UserRepository")
const groupRepo = require("../repositories/GroupRepository")

class GroupService {

    async createGroup({ name, authorId, members }) {
        // minimum members is 3 (+ 1 is authorId)
        if (members.length < 2) {
            return {
                status: 400,
                error: 1,
                message: 'minimum_membership_is_3',
                data: null
            }
        }

        // make sure all members exist
        const checkMembers = await userRepo.findAndCountAllById({ members })
        if (checkMembers.count < members.length) {
            return {
                status: 400,
                error: 0,
                message: 'some_member_not_found',
                data: null
            }
        }

        // create group
        const newGroup = await groupRepo.createGroup({ name, authorId })

        // make members list
        members.push(authorId)
        let memberArr = []
        await members.forEach(memberId => {
            memberArr.push({
                user_id: memberId,
                group_id: newGroup.id,
            })
        })

        // create members list
        const groupMembers = await groupRepo.createMultipleMember({ memberArr })

        return {
            status: 201,
            error: 0,
            message: 'create_group_success',
            data: {
                group: newGroup,
                members: groupMembers
            }
        }
    }

    async getAllByUser({ userId }) {
        const groups = await groupRepo.findAllGroupByUserId({ userId })

        return {
            status: 200,
            error: 0,
            message: 'get_all_group_success',
            data: groups
        }
    }

    async addMember({ authorId, userId, groupId }) {
        const user = await userRepo.findById({ id: userId })
        if (!user) {
            return {
                status: 400,
                error: 1,
                message: 'user_not_found',
                data: null
            }
        }

        const group = await groupRepo.findById({ groupId })
        if (!group) {
            return {
                status: 400,
                error: 1,
                message: 'group_not_found',
                data: null
            }
        }

        if (authorId !== group.author) {
            return {
                status: 400,
                error: 1,
                message: 'you_are_not_author',
                data: null
            }
        }

        const checkMember = await groupRepo.findAMemberById({ userId, groupId })
        if (checkMember) {
            return {
                status: 400,
                error: 1,
                message: 'this_user_is_already_a_member',
                data: null
            }
        }

        const newMember = await groupRepo.addAMember({ userId, groupId })

        return {
            status: 200,
            error: 0,
            message: 'add_member_success',
            data: newMember
        }
    }

    async deleteMember({ authorId, userId, groupId }) {
        if (userId === authorId) {
            return {
                status: 400,
                error: 1,
                message: 'you_are_the_author',
                data: null
            }
        }

        const user = await userRepo.findById({ id: userId })
        if (!user) {
            return {
                status: 400,
                error: 1,
                message: 'user_not_found',
                data: null
            }
        }

        const group = await groupRepo.findById({ groupId })
        if (!group) {
            return {
                status: 400,
                error: 1,
                message: 'group_not_found',
                data: null
            }
        }

        if (authorId !== group.author) {
            return {
                status: 400,
                error: 1,
                message: 'access_denied',
                data: null
            }
        }

        const checkMember = await groupRepo.findAMemberById({ userId, groupId })
        if (!checkMember) {
            return {
                status: 400,
                error: 1,
                message: 'user_is_not_member',
                data: null
            }
        }

        await groupRepo.deleteMember({ userId, groupId })

        return {
            status: 200,
            error: 0,
            message: 'delete_member_success',
            data: null
        }
    }

    async deleteGroup({ authorId, groupId }) {
        const group = await groupRepo.findById({ groupId })
        if (!group) {
            return {
                status: 400,
                error: 1,
                message: 'group_not_found',
                data: null
            }
        }

        if (authorId !== group.author) {
            return {
                status: 400,
                error: 1,
                message: 'you_are_not_author',
                data: null
            }
        }

        await groupRepo.deleteGroup({ groupId })
        await groupRepo.deleteAllMemberByGroup({ groupId })
        await groupRepo.deleteAllMessageByGroup({ groupId })

        return {
            status: 200,
            error: 0,
            message: 'delete_group_success',
            data: null
        }
    }

    // auto create group for message between 2 people
    async createGroupPrivate({ authorId, member }) {
        const user = await userRepo.findById({ id: member })
        if (!user) {
            return {
                status: 400,
                error: 0,
                message: 'user_not_found',
                data: null
            }
        }

        const newGroup = await groupRepo.createGroup({ name: `${authorId}-${member}`, authorId })

        let members = []
        members.push(member)
        members.push(authorId)
        let memberArr = []
        await members.forEach(memberId => {
            memberArr.push({
                user_id: memberId,
                group_id: newGroup.id,
            })
        })

        const groupMembers = await groupRepo.createMultipleMember({ memberArr })

        return {
            status: 201,
            error: 0,
            message: 'create_private_group_success',
            data: {
                group: newGroup,
                members: groupMembers
            }
        }
    }
}

module.exports = new GroupService();
