// Load modules

var Fs = require('fs');
var Path = require('path');
var Handlers = require('./handlers');


// Declare internals


module.exports = {
    data: require('./data'),
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
            handler: Handlers.photo
        },
        {
            method: 'POST',
            path: '/upload',
            config: Handlers.upload
        },
        {
            method: 'GET',
            path: '/feed',
            handler: Handlers.feed
        },
        {
            method: 'GET',
            path: '/static/{path*}',
            config: {
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
