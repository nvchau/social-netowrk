const { validationResult } = require("express-validator");


module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            error: errors.errors[0].msg
        });
    }
    next()
}   