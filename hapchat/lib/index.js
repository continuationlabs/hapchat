// Load modules

var Fs = require('fs');
var Path = require('path');
var Handlers = require('./handlers');


// Declare internals

var internals = {};


module.exports = {
    sockets: require('./sockets'),
    handlers: Handlers
};


module.exports.registerRoutes = function registerRoutes(server) {

    server.route([
        { method: 'GET', path: '/', config: Handlers.home },
        { method: 'GET', path: '/upload', config: Handlers.uploadView },
        { method: 'POST', path: '/upload', config: Handlers.upload },
        { method: 'GET', path: '/photos', config: Handlers.photos },
        { method: 'GET', path: '/photos/{photoId}', config: Handlers.photo },
        { method: 'GET', path: '/login', config: Handlers.login },
        { method: 'GET', path: '/logout', config: Handlers.logout },
        { method: 'GET', path: '/static/{path*}', config: Handlers.stat(server) }
    ]);
};


module.exports.registerMethods = function registerMethods(server) {

    server.method('getNav', function (authenticated, next) {

        var links = [{ name: 'Home', path: '/' }];

        if (authenticated) {
            links.push(
                { name: 'Upload', path: '/upload' },
                { name: 'Photos', path: '/photos' },
                { name: 'Logout', path: '/logout' }
            );
        }
        else {
            links.push(
                { name: 'Login With Github', path: '/login', icon: '/static/images/GitHub-Mark-32px.png' }
            );
        }

        next(null, links, 0);
    });
};


module.exports.initPaths = function initPaths(root) {

    try {
        var photosDir = Path.join(root, 'static', 'photos');

        Fs.mkdirSync(photosDir);
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
};


module.exports.registerStrategies = function registerStrategies(server) {

    // Set session
    server.auth.strategy('session', 'cookie', {
        password: 'cookie_encryption_password',
        cookie: 'sid',
        isSecure: false,
        ttl: server.app.oneDay
    });

    // Github third party auth
    server.auth.strategy('github', 'bell', {
        provider: 'github',
        password: 'cookie_encryption_password',
        clientId: 'd40df1c0836ce9f1ca10',
        clientSecret: '427bc4fc869b17baf53c885f1826821c7f66244b',
        isSecure: false
    });

    server.auth.default('session');
};
