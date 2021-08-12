const generateToken = require("../helpers/generateToken");
const userRepo = require("../repositories/UserRepository")
const sendMail = require('../helpers/sendMail');
const hashPassword = require('../helpers/hashPassword')
const checkPassword = require("../helpers/checkPassword");

class AuthService {

    async login({ email, password }) {
        const user = await userRepo.findByEmail({ email });
        if (!user)
            return {
                status: 400,
                error: 1,
                message: 'email_not_found_or_password_incorrect',
                data: null
            }
        if (!checkPassword(password, user.password)) {
            return {
                status: 400,
                error: 1,
                message: 'email_not_found_or_password_incorrect',
                data: null
            }
        }

        const token = generateToken(user);

        return {
            status: 200,
            error: 0,
            message: 'login_success',
            data: {
                token: token,
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                address: user.address,
                avatar: user.avatar,
                status: user.status,
            }
        }
    }

    logout() {
        userRepo.changeSecretKey();
        return {
            status: 200,
            error: 0,
            message: 'logout_success',
            data: null
        }
    }


    async profile({ payload }) {
        const user = await userRepo.findByEmailExcludePassword({ email: payload.email })

        if (!user)
            return {
                status: 400,
                error: 1,
                message: 'user_not_found',
                data: null
            }

        return {
            status: 200,
            error: 0,
            message: 'get_profile_success',
            data: user

        }
    }

    async updateProfile({ payload, newInfo }) {
        const user = await userRepo.findByEmailExcludePassword({ email: payload.email })

        if (!user)
            return {
                status: 400,
                error: 1,
                message: 'user_not_found',
                data: null
            }

        if (newInfo.avatar) {

        }

        await user.update({
            firstName: newInfo.firstName,
            lastName: newInfo.lastName,
            gender: newInfo.gender,
            address: newInfo.address,
        })

        return {
            status: 200,
            error: 0,
            message: 'update_profile_success',
            data: user
        }
    }

    async changeAvatar({ payload, image }) {
        if (!image)
            return {
                status: 400,
                error: 1,
                message: 'image_required',
                data: null
            }

        const user = await userRepo.findByEmailExcludePassword({ email: payload.email })

        if (!user)
            return {
                status: 400,
                error: 1,
                message: 'user_not_found',
                data: null
            }

        await user.update({
            avatar: `/static/assets/uploads/user-avatars/${image.filename}`
        })

        return {
            status: 200,
            error: 0,
            message: 'change_avatar_success',
            data: user
        }
    }

    async register({ email, password, firstName, lastName, code }) {
        const user = await userRepo.findUserRegisterByEmail({ email })
        if (user) {
            return {
                status : 400,
                error : 1,
                message: 'email_is_existed',
                data: null
            }
        }
        const hashPass = hashPassword(password)

        const newUserRegister = await userRepo.register({ email, password: hashPass, firstName, lastName, code })
        if (!newUserRegister) {
            return {
                status : 400,
                error : 2,
                message: 'user_is_not found',
                data: null
            }
        }
        sendMail(newUserRegister.email, newUserRegister.code).catch(console.error)
        return {
            status: 201,
            error: 0,
            message: 'check_your_email_to_get_code_to_verify',
            data: {
                email: newUserRegister.email,
                code: newUserRegister.code
            }
        }
    }

    async verifyEmail({ email, code }) {
        const user = await userRepo.findUserRegisterByEmail({ email })
        if (!user) {
            return {
                status: 400,
                error: 1,
                message: 'email_is_incorrect',
                data: null
            }
        }
        if(user.code !== code){
            return {
                status : 400,
                error : 2,
                message: 'code_is_incorrect',
                data: null
            }
        }
        const userRegister = await userRepo.userRerister({
            email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName
        })
        if (!userRegister) {
            return {
                status : 400,
                error : 3,
                message: 'register_fail',
                data: null
            }
        }
        return {
            status: 200,
            error: 0,
            message: 'register_success',
            data: null
        }
    }

    async changPassword({ user, password, passwordNew }) {
        if (!checkPassword(password, user.password)) {
            return {
                status: 400,
                error: 1,
                message: 'password_incorrect',
                data: null
            }
        }
        if (passwordNew === password) {
            return {
                status: 400,
                error: 1,
                message: 'password_old',
                data: null
            }
        }
        userRepo.changePassword({ user, passwordNew })
        return {
            status: 200,
            error: 0,
            message: 'change_password_success',
            data: user.email
        }
    }

    async verifyEmailTochangePass({ email, code }) {
        const user = await userRepo.findByEmail({ email })
        if (!user) {
            return {
                status: 400,
                error: 1,
                message: 'email_is_not_exist',
                data: null
            }
        }

        const user_id = user.id
        const user_forgot = await userRepo.findByEmailChangePassword({ user_id })
        //console.log(user_forgot)
        if (!user_forgot) {
            const userForgotPass = await userRepo.forgotPassword({ code, user_id })

            if (!userForgotPass) {
                return {
                    status: 400,
                    error: 1,
                    message: 'cannot_insert_into_forgotpassword_table',
                    data: null
                }
            } else {
                sendMail(email, code).catch(console.error)
                return {
                    status: 200,
                    error: 0,
                    message: 'check_your_email_to_get_code_to_verify',
                    data: userForgotPass
                }
            }
        }
        const updateCodeUser = await userRepo.updateCode({ user_id, code })
        if (!updateCodeUser) {
            return {
                status: 400,
                error: 1,
                message: 'cannot_update_code',
                data: null
            }
        }
        sendMail(email, code).catch(console.error)
        return {
            status: 200,
            error: 0,
            message: 'check_your_email_to_get_code_to_verify',
            data: {
                id: user_forgot.id,
                code,
                user_id,
            }
        }
    }

    async updatePasswordForgot({ code, user_id, password }) {
        const user_forgot = await userRepo.findByEmailChangePassword({ user_id })
        if (!user_forgot) {
            return {
                status: 400,
                error: 1,
                message: 'userId_not_found',
                data: null
            }
        }
        if (user_forgot.code !== code) {
            return {
                status: 400,
                error: 1,
                message: 'code_incorrect',
                data: null
            }
        }
        const new_password = hashPassword(password)
        const user = await userRepo.createNewPassword({ user_id, new_password })
        if (!user) {
            return {
                status: 400,
                error: 1,
                message: 'cannot_update_password_forgot',
                data: null
            }
        }
        return {
            status: 200,
            error: 0,
            message: 'update_success_forgot_password',
            data: null
        }
    }

}
module.exports = new AuthService();
