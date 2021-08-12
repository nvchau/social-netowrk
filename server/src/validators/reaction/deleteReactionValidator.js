const { param } = require("express-validator");

module.exports = [
    param('post_id')
        .notEmpty()
        .withMessage('post_id_is_required')
        .isNumeric()
        .withMessage('post_id_is_number')
]
