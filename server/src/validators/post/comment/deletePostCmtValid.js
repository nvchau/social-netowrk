const { param } = require("express-validator");

module.exports = [
    param('commentId')
    .isNumeric()
    .withMessage('commentID_not_is_a_number')
]