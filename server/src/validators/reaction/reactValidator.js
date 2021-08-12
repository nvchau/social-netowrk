const { body, param } = require("express-validator");

module.exports = [
    body('type')
        .notEmpty()
        .withMessage('type_is_require')
        .isNumeric()
        .withMessage('type_is_number'),
    param('post_id')
        .notEmpty()
        .withMessage('post_id_is_required')
        .isNumeric()
        .withMessage('post_id_is_number')
]

