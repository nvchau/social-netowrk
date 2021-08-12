const { body, param } = require("express-validator");

module.exports = [
    param('userId')
        .notEmpty()
        .withMessage('userId_is_required'),
    param('userId')
        .isNumeric()
        .withMessage('userId_must_be_number'),
    param('groupId')
        .notEmpty()
        .withMessage('groupId_is_required'),
    param('groupId')
        .isNumeric()
        .withMessage('groupId_must_be_number')
]
