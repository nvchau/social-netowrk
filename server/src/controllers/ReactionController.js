const ReactionService = require('../services/ReactionService')

class ReactionController {
    async react(req, res){
        try {
            const user_id = req.payload.id
            const {post_id} = req.params
            const {type} = req.body
            const response = await ReactionService.reactive({user_id, post_id, type})
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status : 500,
                error : 1,
                message: err.message,   
                data : null
            })
        }
    }
    async deleteReaction(req, res){
        try {
            const user_id = req.payload.id
            const {post_id} = req.params
            const response = await ReactionService.deleteReaction({user_id, post_id})
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status : 500,
                error : 1,
                message: err.message,   
                data : null
            })
        }
    }

    async getAllReactionOfPost(req, res){
        try {
            const {post_id} = req.params
            const response = await ReactionService.getAllReaction({post_id})
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status : 500,
                error : 1,
                message: err.message,   
                data : null
            })
        }
    }
}
module.exports = new ReactionController()