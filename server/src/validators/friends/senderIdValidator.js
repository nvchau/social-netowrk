const { param } = require("express-validator");

module.exports = [
    param('sender_id')
        .notEmpty()
        .withMessage('sender_is_required')
        .isNumeric()
        .withMessage('id_is_number')
]