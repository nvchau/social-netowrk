const jwt = require('jsonwebtoken');
require('dotenv').config();
const Env = process.env;

module.exports = function (user) {
    const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        address: user.address,
        avatar: user.avatar,
        status: user.status,
    };
    const token = jwt.sign(payload, Env.ACCESS_TOKEN_SECRET);
    return token;
}
