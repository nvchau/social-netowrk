const postCmtService = require("../services/PostCmtService");

class PostCmtController {
    async getAll(req, res) {
        const { id } = req.params;
        const response = await postCmtService.getAll({ id });
        return res.status(200).json(response);
    }

    async create(req, res) {
        const { id } = req.params;
        const userId = req.payload.id;

        let content = req.body.content;
        let type = 'text';
        let image = req.file;
        console.log(req.file);
        if (image) {
            type = 'img'
            content = `/static/assets/uploads/posts/${image.filename}`
        }

        const response = await postCmtService.create({ id, userId, content, type })
        return res.status(200).json(response);
    }

    async update(req, res) {
        const { id, commentId } = req.params;
        console.log(req.params);
        const userId = req.payload.id;
        console.log('userId', userId);
        let content = req.body.content;
        let image = req.file;
        let type = 'text';
        if (image) {
            type = 'img'
            content = `/static/assets/uploads/posts/${image.filename}`;
        }

        const response = await postCmtService.update({ id, commentId, userId, content, type });
        return res.status(200).json(response);
    }

    async delete(req, res) {
        const { id, commentId } = req.params;
        const userId = req.payload.id;
        const response = await postCmtService.delete({ id, commentId, userId });
        return res.status(200).json(response);
    }
}

module.exports = new PostCmtController();