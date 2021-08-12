const jwt = require('jsonwebtoken');
require('dotenv').config();
const Env = process.env;

module.exports = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token)
        return next({
            status: 401,
            error: 1,
            message: 'Invalid_token',
            data: null
        })
    try {
        const decoded = jwt.verify(token, Env.ACCESS_TOKEN_SECRET);
        //return payload
        req.payload = decoded;
        next();
        
    } catch (error) {
        return next({
            status: 401,
            error: 1,
            message: error.message,
            data: null
        })
    }

};
