const routePrefix = '/api/v1';
const authRoute = require('./auth');
const groupRoute = require('./group');
const postRoute = require('./post');
const friendRoute = require('./friend');

function route(app) {
    app.use(`${routePrefix}/auth`, authRoute);
    app.use(`${routePrefix}/posts`, postRoute);
    app.use(`${routePrefix}/auth`, authRoute);
    app.use(`${routePrefix}/groups`, groupRoute);
    app.use(`${routePrefix}/friends`, friendRoute);
}

module.exports = route;