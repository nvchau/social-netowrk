const postRepo = require("../repositories/PostRepository")

class PostService {
    async getAll() {
        const result = await postRepo.getAll();
        if (result.length < 1)
            return {
                status: 404,
                error: 1,
                message: 'post_not_found',
                data: null
            }
        return {
            status: 200,
            error: 0,
            message: 'get_all_posts',
            data: result
        }
    }

    async getAllByUser({ userId }) {
        const result = await postRepo.getAllByUser({ userId });
        if (result.length < 1)
            return {
                status: 404,
                error: 1,
                message: 'post_not_found',
                data: null
            }
        return {
            status: 200,
            error: 0,
            message: 'get_all_posts_of_user_id_' + userId,
            data: result
        }
    }

    async getDetail(id) {
        const result = await postRepo.getById(id);
        if (!result)
            return {
                status: 404,
                error: 1,
                message: 'post_not_found',
                data: null
            }
        return {
            status: 200,
            error: 0,
            message: 'get_detail_post',
            data: result
        }
    }

    async create({ userId, title, content, image }) {
        const postNew = { title, content, image };
        const result = await postRepo.create({ userId, postNew });
        if (!result)
            return {
                status: 400,
                error: 1,
                message: 'add_post_failed',
                data: null
            }
        return {
            status: 201,
            error: 0,
            message: 'added_success',
            data: result
        }
    }

    async update({ id, userId, title, content, image }) {

        let result = await postRepo.getById(id);
        if (!result)
            return {
                status: 404,
                error: 1,
                message: 'post_not_found',
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
        const postNew = { title, content, image };
        const check = await postRepo.update({ id, userId, postNew });
        if (check.length < 1)
            if (!result)
                return {
                    status: 400,
                    error: 1,
                    message: 'add_post_failed',
                    data: null
                }
        result = await postRepo.getById(id)
        return {
            status: 200,
            error: 0,
            message: 'updated_success',
            data: result
        }
    }

    async delete({ id, userId }) {
        const result = await postRepo.getById(id);

        if (!result)
            return {
                status: 404,
                error: 1,
                message: 'post_not_found',
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
        await postRepo.delete({ id });
        return {
            status: 200,
            error: 0,
            message: 'delete_success',
            data: result
        }
    }


}

module.exports = new PostService();