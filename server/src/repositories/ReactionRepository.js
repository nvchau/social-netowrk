const db = require("../models")

class ReactionRepository {
    async createReaction({user_id, post_id, type}){
        const createReact = await db.Reaction.create({
            userId: user_id,
            postId: post_id,
            type
        })
        return createReact  
    }

    async updateReaction({user_id, post_id, type}){
        const updateReact = await db.Reaction.update({type},{
            where : {
                user_id,
                post_id
            }
        })
        return updateReact
    }
    async findReaction({user_id, post_id}){
        const findReact = await db.Reaction.findOne({
            where : {
                user_id,
                post_id
            }
        })
        return findReact
    }

    async deleteReaction({user_id, post_id}){
        const deleteReact = await db.Reaction.destroy({
            where : {
                user_id,
                post_id
            }
        })
        return deleteReact
    }

    async getAllReact({post_id}){
        const listReaction = await db.Reaction.findAll({
            attributes : ['user_id', 'type']
        },{
            where : {
                post_id
            }
        })
        return listReaction
    }
}

module.exports = new ReactionRepository()