const deletePostValid = require("./deletePostValid");
const createPostValid = require("./createPostValid");

module.exports = deletePostValid.concat(createPostValid);

