const { body } = require("express-validator");

module.exports = [
        body('email')
        .notEmpty()
        .withMessage('email_is_required')
        .isEmail()
        .withMessage('invalid_email')
]