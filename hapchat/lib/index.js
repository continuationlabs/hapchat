// Load modules

var Fs = require('fs');
var Path = require('path');
var Handlers = require('./handlers');


// Declare internals


module.exports = {
    sockets: require('./sockets'),
    handlers: Handlers
};


module.exports.registerRoutes = function registerRoutes(server) {

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: Handlers.home
        },
        {
            method: 'GET',
            path: '/upload',
            config: {
                auth: 'session',
                handler: Handlers.photo
            }
        },
        {
            method: 'POST',
            path: '/upload',
            config: Handlers.upload
        },
        {
            method: 'GET',
            path: '/feed',
            config: Handlers.feed
        },
        {
            method: 'GET',
            path: '/login',
            config: Handlers.login
        },
        {
            method: 'GET',
            path: '/static/{path*}',
            config: {
                auth: 'session',
                handler: {
                    directory: {
                        path: Path.join(server.settings.app.root, 'static'),
                        index: false
                    }
                },
                cache: {
                    expiresIn: server.settings.app.oneDay * 10
                }
            }
        }
    ]);
};


module.exports.registerMethods = function registerMethods(server) {

    server.method('getNav', function (authenticated, next) {

        var links = [{
            name: 'Home',
            path: '/'
        }];

        if (authenticated) {
            links.push({
                name: 'Upload',
                path: '/upload'
            },
            {
                name: 'Feed',
                path: '/feed'
            });
        }
        else {
            links.push({
                name: 'Login',
                path: '/login'
            });
        }

        next(null, links, 0);
    });
};


module.exports.initPaths = function initPaths(root) {

    try {
        var dataDir = Path.join(root, 'data');

        Fs.mkdirSync(dataDir);
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }

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


module.exports.registerStrategies = function (server) {

    // Set session
    server.auth.strategy('session', 'cookie', {
        password: 'cookie_encryption_password',
        cookie: 'sid',
        isSecure: false,
        redirectTo: '/login',
        ttl: server.app.oneDay
    });

    // Github third party auth
    server.auth.strategy('github', 'bell', {
        provider: 'github',
        password: 'cookie_encryption_password',
        clientId: 'd40df1c0836ce9f1ca10',
        clientSecret: '1916660d600d84974d27911b1fe7983c7946cd8b',
        isSecure: false
    });
};
