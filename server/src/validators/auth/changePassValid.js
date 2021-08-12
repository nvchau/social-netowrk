const { body } = require("express-validator");

module.exports = [
    body('password')
        .notEmpty()
        .withMessage('password_is_required')
        .isLength({ min: 8 })
        .withMessage('password_must_be_at_least_8_chars_long'),
    body('passwordNew')
        .notEmpty()
        .withMessage('passwordNew_is_required')
        .isLength({ min: 8 })
        .withMessage('passwordNew_must_be_at_least_8_chars_long'),
]

