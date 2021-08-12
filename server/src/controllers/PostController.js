const postService = require("../services/PostService");

class PostController {
    async getAll(req, res) {
        const response = await postService.getAll();
        return res.status(200).json(response);
    }

    async getAllByUser(req, res) {
        const userId = req.payload.id;
        const response = await postService.getAllByUser({userId});
        return res.status(200).json(response);
    }

    async getDetail(req, res) {
        const id = req.params.id;
        const response = await postService.getDetail(id);
        return res.status(200).json(response);
    }

    async create(req, res) {
        const { title, content } = req.body;
        let image = null;
        if (req.file) {
            image = `/static/assets/uploads/posts/${req.file.filename}`
        }
        const response = await postService.create({ userId: req.payload.id, title, content, image });
        return res.status(200).json(response);
    }

    async update(req, res) {
        const id = req.params.id;
        let image = null;
        if (req.file) {
            image = `/static/assets/uploads/posts/${req.file.filename}`
        }
        const { title, content } = req.body;
        const response = await postService.update({ id, userId: req.payload.id, title, content, image });
        return res.status(200).json(response);
    }


    async delete(req, res) {
        const id = req.params.id;
        const userId = req.payload.id;
        const response = await postService.delete({id, userId});
        return res.status(200).json(response);
    }

}

module.exports = new PostController();
