const ReactionRepository = require('../repositories/ReactionRepository')
const PostRepository = require('../repositories/PostRepository')
class ReactionService {
    async reactive({user_id, post_id, type}){
        const post = await PostRepository.getById(post_id)
        if(!post){
            return {
                status: 400,
                error: 1,
                message: 'post_is_not_exist',
                data: null
            } 
        }
        const findReact = await ReactionRepository.findReaction({user_id, post_id})
        if(!findReact){
            const create = await ReactionRepository.createReaction({user_id, post_id, type})
            if(!create){
                return {
                    status: 400,
                    error: 1,
                    message: 'reaction_fail',
                    data: null
                }
            }
            return {
                status: 200,
                error: 0,
                message: 'reaction_success',
                data: null
            }
        }
        const update = await ReactionRepository.updateReaction({user_id, post_id, type})
        if(!update){
            return {
                status: 400,
                error: 1,
                message: 'reaction_fail',
                data: null
            }
        }
        return {
            status: 200,
            error: 0,
            message: 'update_reaction_success',
            data: null
        }
    }
    async deleteReaction({user_id, post_id}){
        const deleteReact = await ReactionRepository.deleteReaction({user_id, post_id})
        if(!deleteReact){
            return {
                status: 400,
                error: 1,
                message: 'delete_fail',
                data: null
            }
        }
        return {
            status: 200,
            error: 0,
            message: 'delete_success',
            data: null
        }
    }

    async getAllReaction({post_id}){
        const list = await ReactionRepository.getAllReact({post_id})
        if(!list){
            return {
                status: 400,
                error: 1,
                message: 'cannot_get_list_reaction',
                data: null
            }
        }
        return {
            status: 200,
            error: 0,
            message: 'list_reaction_of_post',
            data: list
        }
    }
}
module.exports = new ReactionService()