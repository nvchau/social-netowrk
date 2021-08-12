const { body } = require("express-validator");

module.exports = [
    body('title')
        .notEmpty()
        .withMessage('title_is_required')
        .isLength({ min: 3 })
        .withMessage('title_must_be_at_least_3_chars_long'),
    body('content')
        .notEmpty()
        .withMessage('content_is_required')
        .isLength({ min: 6 })
        .withMessage('content_must_be_at_least_6_chars_long')
]
