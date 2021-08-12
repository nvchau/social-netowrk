const express = require("express");
const router = express.Router()
const authCtrl = require("../src/controllers/AuthController");
const validatorHelper = require("../src/helpers/validatorHelper");
const loginValidator = require("../src/validators/auth/loginValidator");
const updateProfileValidator = require("../src/validators/auth/updateProfileValidator");
const registerValidator = require('../src/validators/auth/registerValidator');
const verifyToken = require("../src/middlewares/verifyToken");
const postCtrl = require('../src/controllers/PostController');
const changePassValid = require("../src/validators/auth/changePassValid");
const uploadImage = require("../src/helpers/uploadImage")
const forgotPasswordValidator = require('../src/validators/auth/forgotPasswordValidator')
const verifyEmailValidator = require('../src/validators/auth/verifyEmailValidator')


router.post('/register', registerValidator, validatorHelper, authCtrl.register);
router.post('/login', loginValidator, validatorHelper, authCtrl.login);
router.post('/verify_email', verifyEmailValidator, validatorHelper, authCtrl.verifyEmail);
router.post('/verify_forgot_password', verifyEmailValidator, validatorHelper, authCtrl.verifyEmailTochangePassword)
router.post('/update_forgot_password/:user_id', forgotPasswordValidator, validatorHelper, authCtrl.updateForgotPass)


router.use(verifyToken);

router.get('/profile', authCtrl.profile);
router.put('/profile', updateProfileValidator, validatorHelper, authCtrl.updateProfile);
router.put('/profile/change-avatar',
    uploadImage.uploadFile({ savePath: 'user-avatars', uploadName: 'image' }),
    authCtrl.changeAvatar
);
router.get('/posts', postCtrl.getAllByUser);
router.post('/logout', authCtrl.logout);
router.put('/change-pass', changePassValid, validatorHelper, authCtrl.changePassword)

module.exports = router;