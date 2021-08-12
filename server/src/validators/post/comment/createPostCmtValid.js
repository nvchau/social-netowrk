const {check} = require("express-validator");

module.exports = [
    check('content')
        .custom((value, { req }) => {
            if (req.file || req.body.content) {
                return true;
            } else {
                return false;
            }
        })
        .withMessage('content_is_required')
]

