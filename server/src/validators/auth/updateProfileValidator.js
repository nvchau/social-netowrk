const { body } = require("express-validator");

module.exports = [
    body('firstName')
        .notEmpty()
        .withMessage('firstName_is_required')
        .withMessage('invalid_firstName'),
    body('lastName')
        .notEmpty()
        .withMessage('lastName_is_required')
        .withMessage('invalid_lastName'),
]
