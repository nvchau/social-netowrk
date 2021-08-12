const { param } = require("express-validator");

module.exports = [
    param('receive_id')
        .notEmpty()
        .withMessage('receive_is_required')
        .isNumeric()
        .withMessage('id_is_number')
]