const authService = require("../services/AuthService")
const generateCode = require('../helpers/generateCode')
const userRepo = require("../repositories/UserRepository")

class AuthController {

    async register(req, res) {
        try {
            const {email, password, firstName, lastName} = req.body
            const code = generateCode()
            const response = await authService.register({email, password, firstName, lastName, code})
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }

    async verifyEmail(req, res) {
        try {
            const { email, code } = req.body
            const response = await authService.verifyEmail({ email, code })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        const response = await authService.login({ email, password });

        return res.status(200).json(response);
    }

    logout(req, res) {
        res.cookie('jwt', '', { maxAge: 1 });
        return res.json({
            "status": 200,
            "error": 0,
            "message": "logout_success",
            "data": null
        });
    }

    async changePassword(req, res) {
        const { password, passwordNew } = req.body;
        const { email } = req.payload;
        const user = await userRepo.findByEmail({ email });
        const response = await authService.changPassword({ user, password, passwordNew });
        return res.status(200).json(response);
    }

    async profile(req, res, next) {
        const response = await authService.profile({ payload: req.payload })

        return res.status(200).json(response);
    }

    async updateProfile(req, res, next) {
        const response = await authService.updateProfile({ payload: req.payload, newInfo: req.body })

        return res.status(200).json(response);
    }

    async changeAvatar(req, res, next) {
        const response = await authService.changeAvatar({ payload: req.payload, image: req.file })

        return res.status(200).json(response);
    }
    async verifyEmailTochangePassword(req, res) {
        try {
            const { email } = req.body
            const code = generateCode()
            const response = await authService.verifyEmailTochangePass({ email, code })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }

    async updateForgotPass(req, res) {
        try {
            const { password, code } = req.body
            const { user_id } = req.params
            const response = await authService.updatePasswordForgot({ code, user_id, password })
            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                error: 1,
                message: err.message,
                data: null
            })
        }
    }
}
module.exports = new AuthController();
