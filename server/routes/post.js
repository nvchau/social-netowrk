const express = require('express');
const router = express.Router();
const postCtrl = require('../src/controllers/PostController');
const postCmtCtrl = require('../src/controllers/PostCmtController');
const verifyToken = require('../src/middlewares/verifyToken');
const uploadImage = require("../src/helpers/uploadImage")
const ReactionController = require('../src/controllers/ReactionController')


//validate import
const validatorHelper = require("../src/helpers/validatorHelper");
const createPostValid = require('../src/validators/post/createPostValid');
const updatePostValid = require('../src/validators/post/updatePostValid');
const deletePostValid = require('../src/validators/post/deletePostValid');
const createPostCmtValid = require('../src/validators/post/comment/createPostCmtValid');
const updatePostCmtValid = require('../src/validators/post/comment/updatePostCmtValid');
const deletePostCmtValid = require('../src/validators/post/comment/deletePostCmtValid');
const reactValidator = require('../src/validators/reaction/reactValidator')
const deleteReactValidator = require('../src/validators/reaction/deleteReactionValidator')
const validationResult = require('../src/helpers/validatorHelper')



router.get('/', postCtrl.getAll);

router.get('/:id', postCtrl.getDetail);


//comment
router.get('/:id/comments', postCmtCtrl.getAll);


router.use(verifyToken);

router.post('/', uploadImage.uploadFile({ savePath: 'posts', uploadName: 'image' }), createPostValid, validatorHelper, postCtrl.create);

router.put('/:id', uploadImage.uploadFile({ savePath: 'posts', uploadName: 'image' }), updatePostValid, validatorHelper, postCtrl.update);

router.delete('/:id', deletePostValid, validatorHelper, postCtrl.delete);

//comment
router.post('/:id/comments', uploadImage.uploadFile({ savePath: 'posts', uploadName: 'content' }), createPostCmtValid, validatorHelper, postCmtCtrl.create);

router.put('/:id/comments/:commentId', uploadImage.uploadFile({ savePath: 'posts', uploadName: 'content' }), updatePostCmtValid, validatorHelper, postCmtCtrl.update);

router.delete('/:id/comments/:commentId', deletePostCmtValid, validatorHelper, postCmtCtrl.delete);

// post reaction
router.post('/:post_id/reaction', reactValidator, validationResult, ReactionController.react)
router.delete('/:post_id/reaction', deleteReactValidator, validationResult, ReactionController.deleteReaction)
router.get('/:post_id/list_reaction', ReactionController.getAllReactionOfPost)


module.exports = router;

