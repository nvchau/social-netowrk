const { body, param } = require("express-validator");

module.exports = [
    body('password')
        .notEmpty()
        .withMessage('password_is_required')
        .isLength({ min: 8 })
        .withMessage('password_must_be_at_least_8_chars_long'),
    body('code')
        .notEmpty()
        .withMessage('code_is_required')
        .isLength({ min: 6 })
        .withMessage('code_must_be_at_least_6_chars_long'),
    param('user_id')
        .notEmpty().withMessage('user_id_is_require')
        .isNumeric().withMessage('id_is_number')
]