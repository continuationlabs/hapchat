// Load modules

var Path = require('path');
var Hapi = require('hapi');
var Lib = require('./lib');


// Declare internals

var internals = {
    port: process.env.PORT || 8000
};


internals.main = function main() {

    // Create required directories before anything else is done
    Lib.initPaths(__dirname);

    var server = new Hapi.Server(internals.port, {
        app: {
            oneDay: 86400000,
            root: __dirname,
            db: Lib.data.initDb()
        }
    });

    // Register views
    server.views({
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'static', 'views')
    });

    // Register plugins

    // Register routes
    Lib.registerRoutes(server);

    // Start the server
    server.start(function start() {

        console.log('Hapchat started at ' + server.info.uri);
    });
};

internals.main();
