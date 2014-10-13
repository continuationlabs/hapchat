// Load modules

var Path = require('path');
var Hapi = require('hapi');
var Handlers = require('./lib/handlers');


// Declare internals

var internals = {
    port: process.env.PORT || 8000
};


internals.main = function main() {

    var server = new Hapi.Server(internals.port, {
        app: {
            oneDay: 86400000
        }
    });

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'static', 'views')
    });

    // Register plugins

    // Register routes
    server.route([{
        method: 'GET',
        path: '/static/{path*}',
        config: {
            handler: {
                directory: {
                    path: Path.join(__dirname, 'public'),
                    index: false
                }
            },
            cache: {
                expiresIn: server.settings.app.oneDay * 10
            }
        }
    }, {
        method: 'GET',
        path: '/',
        handler: Handlers.home
    }, {
        method: 'POST',
        path: '/upload',
        config: Handlers.upload
    }]);

    server.start(function start() {

        console.log('Hapchat started at ' + server.info.uri);
    });
};

internals.main();
