const db = require("../models");
const PostComment = require('../models/postcomment');

class PostCmtRepository {
    async getAll({ id }) {
        return await db.PostComment.findAll({
            where: {
                postId: id
            }
        });
    }

    async getById({ id, commentId }) {
        return await db.PostComment.findOne({
            where: {
                postId: id,
                id: commentId
            }
        })
    }

    async create({ id, userId, content, type }) {
        return await db.PostComment.create({
            postId: id,
            userId: userId,
            content: content,
            type: type
        })
    }

    async update({ id, commentId, userId, content, type }) {
        return await db.PostComment.update({
            postId: id,
            userId: userId,
            content: content,
            type: type
        }, {
            where: {
                postId: id,
                id: commentId
            }
        })
    }

    async delete({ id, commentId }) {
        return await db.PostComment.destroy({
            where: {
                postId: id,
                id: commentId
            }
        })
    }

}

module.exports = new PostCmtRepository();