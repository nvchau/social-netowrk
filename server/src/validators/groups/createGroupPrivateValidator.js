const { param } = require("express-validator");

module.exports = [
    param('userId')
        .notEmpty()
        .withMessage('userId_is_required')
]
