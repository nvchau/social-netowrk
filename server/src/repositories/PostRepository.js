const db = require("../models");
const Post = require("../models/post");

class PostRepository {

    async getAll() {
        return await db.Post.findAll();
    }

    async getById(id) {
        return await db.Post.findOne({
            where: {
                id: id
            }
        })
    }

    async getAllByUser({userId}) {
        return await db.Post.findAll({
            where: {
                userId: userId
            }
        });
    }



    async create({ userId, postNew }) {
        return await db.Post.create({
            userId: userId,
            title: postNew.title,
            content: postNew.content,
            image: postNew.image,
        });
    }

    async update({ id, userId, postNew }) {
        return await db.Post.update({
            userId: userId,
            title: postNew.title,
            content: postNew.content,
            image: postNew.image,
        }, {
            where: {
                id: id
            }
        });
    }

    async delete({id}) {
        return await db.Post.destroy({
            where: {
                id: id
            }
        })
    }

}

module.exports = new PostRepository();
