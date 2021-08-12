const { param } = require("express-validator");

module.exports = [
    param('id')
    .isNumeric()
    .withMessage('Id_not_is_a_number')
]
