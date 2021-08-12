const {body} = require('express-validator')

module.exports = [
    body('email')
        .notEmpty().withMessage('email_is_required')
        .isEmail().withMessage('invalid_email'),
    body('password')
        .notEmpty().withMessage('password_is_required')
        .isLength({min: 8}).withMessage('password_is_required_with_min_8_characters')
]