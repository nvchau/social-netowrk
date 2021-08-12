const db = require("../models");
const hashPassword = require('../helpers/hashPassword')
require('dotenv').config();
const Env = process.env;

class UserRepository {

    async findById({ id }) {
        const user = await db.User.findOne({
            where: {
                id: id
            }
        })
        return user;
    }

    async findAndCountAllById({ members }) {
        const users = db.User.findAndCountAll({
            where: {
                id: members
            }
        })

        return users
    }

    async findByEmail({ email }) {
        const user = await db.User.findOne({
            where: {
                email: email
            }
        })
        return user;
    }

    async changePassword({ user, passwordNew }) {
        const hashPasswordNew = hashPassword(passwordNew);
        return await db.User.update({ password: hashPasswordNew }, {
            where: {
                email: user.email
            }
        });
    }

    async findUserRegisterByEmail({ email }) {
        const user = await db.Register.findOne({
            where: {
                email: email
            }
        })
        return user;
    }
    
    async register ({email, password, firstName, lastName, code}){
        const newUserRegister = await db.Register.create({email, password, firstName, lastName, code })
        return newUserRegister
    }

    async userRerister({email, password, firstName, lastName}){
            const userRegis = await db.User.create({
                email,
                password,
                firstName,
                lastName
            })
            return userRegis
    }

    async findByEmailExcludePassword({ email }) {
        const user = await db.User.findOne({
            where: {
                email: email
            },
            attributes: { exclude: ['password'] }
        })
        return user;
    }
    async forgotPassword({ code, user_id }) {
        console.log(user_id)
        const user = await db.ForgotPassword.create({
            code,
            userId: user_id
        })
        return user
    }

    async findByEmailChangePassword({ user_id }) {
        const user = await db.ForgotPassword.findOne({
            where: {
                user_id
            }
        })
        return user
    }

    async updateCode({ user_id, code }) {
        const user = await db.ForgotPassword.update({ code }, {
            where: {
                user_id
            }
        })
        return user
    }

    async createNewPassword({ user_id, new_password }) {
        const user = await db.User.update({ password: new_password }, {
            where: {
                id: user_id
            }
        })
        return user
    }


}

module.exports = new UserRepository();
