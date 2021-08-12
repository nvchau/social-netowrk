const db = require("../models");
const { Op } = require("sequelize");

class GroupRepository {
    async createGroup({ name, authorId }) {
        const newGroup = await db.GroupChat.create({ 
            name,
            author: authorId,
        })

        return newGroup
    }

    async createMultipleMember({ memberArr }) {
        const newMembers = await db.GroupMember.bulkCreate(memberArr)

        return newMembers
    }

    async findByNameId({ senderId, receiverId }) {
        const group = await db.GroupChat.findOne({
            where: {
                [Op.or]: [
                    { name: `${senderId}-${receiverId}` },
                    { name: `${senderId}-${receiverId}` },
                ]
            }
        })

        return group
    }
    
    async findAllGroupByUserId({ userId }) {
        const groups = await db.GroupMember.findAll({
            required: true,
            where: {
                userId: userId
            },
            order: [
                [ 'last_message_timestamp', 'DESC' ],
                [ db.GroupChat, db.Message, 'created_at', 'ASC' ],
            ],
            include: [
                {
                    as: 'last_message',
                    model: db.Message,
                    include: [
                        {
                            model: db.User,
                            required: true,
                            attributes: { exclude: ['password'] },
                        }
                    ]
                },
                { 
                    model: db.GroupChat,
                    required: true,
                    include: [
                        {
                            model: db.GroupMember,
                            required: true,
                            include: [
                                {
                                    model: db.User,
                                    required: true,
                                    attributes: { exclude: ['password'] },
                                }
                            ]
                        },
                        {
                            model: db.Message,
                            include: [
                                {
                                    model: db.User,
                                    required: true,
                                    attributes: { exclude: ['password'] },
                                }
                            ],
                        }
                    ]
                },
            ],
        })

        return groups
    }

    async findById({ groupId }) {
        const group = await db.GroupChat.findOne({ 
            where: { id: groupId }
        })

        return group
    }

    async findAMemberById({ userId, groupId }) {
        const member = await db.GroupMember.findOne({
            where: { 
                userId: userId, 
                groupId: groupId 
            }
        })

        return member
    }

    async findAllMember({ groupId }) {
        const members = await db.GroupMember.findAll({
            where: { 
                groupId: groupId 
            }
        })

        return members
    }

    async addAMember({ userId, groupId }) {
        const member = await db.GroupMember.create({ userId: userId, groupId: groupId })

        return member
    }

    async deleteMember({ userId, groupId}) {
        try {
            await db.GroupMember.destroy({
                where: {
                    userId: userId,
                    groupId: groupId
                }
            })
    
            return true
        } catch (error) {
            return false
        }
    }

    async deleteGroup({ groupId }) {
        try {
            await db.GroupChat.destroy({
                where: {
                    id: groupId
                }
            })
    
            return true
        } catch (error) {
            return false
        }
    }

    async deleteAllMemberByGroup({ groupId }) {
        try {
            await db.GroupMember.destroy({
                where: {
                    groupId: groupId
                }
            })
    
            return true
        } catch (error) {
            return false
        }
    }

    async deleteAllMessageByGroup({ groupId }) {
        try {
            await db.Message.destroy({
                where: {
                    groupchatId: groupId
                }
            })
    
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = new GroupRepository();
