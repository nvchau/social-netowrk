const createPostValid = require("../createPostValid");
const createPostCmtValid = require("./createPostCmtValid");
const deletePostCmtValid = require("./deletePostCmtValid");

module.exports = deletePostCmtValid.concat(createPostCmtValid);
