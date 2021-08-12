const { body, param } = require("express-validator");

module.exports = [
    param('groupId')
        .notEmpty()
        .withMessage('groupId_is_required'),
    param('groupId')
        .isNumeric()
        .withMessage('groupId_must_be_number'),
    body('type')
        .notEmpty()
        .withMessage('type_is_required'),
    body('content')
        .notEmpty()
        .withMessage('content_is_required'),
]
