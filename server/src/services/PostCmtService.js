const postCmtRepo = require("../repositories/PostCmtRepository");
const postService = require("./PostService");

class PostCmtService {
    async getAll({ id }) {
        const post = await postService.getDetail(id);

        //check post exist
        if (post.data == null) return post;

        const result = await postCmtRepo.getAll({ id });
        if (result.length < 1)
            return {
                status: 404,
                error: 1,
                message: 'comments_not_found',
                data: null
            }
        return {
            status: 200,
            error: 0,
            message: 'get_all_comments_of_post_id=' + id,
            data: result
        }
    }

    async create({ id, userId, content, type }) {
        const post = await postService.getDetail(id);

        //check post exist
        if (post.data == null) return post;

        const result = await postCmtRepo.create({ id, userId, content, type });
        if (!result)
            return {
                status: 400,
                error: 1,
                message: 'add_comment_failed',
                data: null
            }
        return {
            status: 201,
            error: 0,
            message: 'added_success',
            data: result
        }
    }

    async update({ id, commentId, userId, content, type }) {

        const post = await postService.getDetail(id);

        //check post exist
        if (post.data == null) return post;

        let result = await postCmtRepo.getById({ id, commentId });

        if (!result)
            return {
                status: 404,
                error: 1,
                message: 'comment_not_found',
                data: null
            }
        //verify user
        if (userId !== result.userId)
            return {
                status: 403,
                error: 1,
                message: 'forbidden',
                data: null
            }

        const check = await postCmtRepo.update({ id, commentId, userId, content, type });

        if (check.length < 1) {
            return {
                status: 400,
                error: 1,
                message: 'update_failed',
                data: null
            }
        }
        result = await postCmtRepo.getById({ id, commentId });
        return {
            status: 200,
            error: 0,
            message: 'updated_success',
            data: result
        }
    }

    async delete({ id, commentId, userId }) {
        const post = await postService.getDetail(id);

        //check post exist
        if (post.data == null) return post;

        const result = await postCmtRepo.getById({ id, commentId });
        if (!result)
        return {
            status: 404,
            error: 1,
            message: 'comment_not_found',
            data: null
        }
        
        //verify user
        if (userId !== result.userId)
            return {
                status: 403,
                error: 1,
                message: 'forbidden',
                data: null
            }

        await postCmtRepo.delete({ id, commentId });
        return {
            status: 200,
            error: 0,
            message: 'delete_success',
            data: result
        }
    }


}

module.exports = new PostCmtService();