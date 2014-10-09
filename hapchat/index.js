// Load modules

var Hapi = require('hapi');
var Handlers = require('./lib/handlers');


// Declare internals

var internals = {
    port: process.env.PORT || 8000
};


internals.main = function main() {

    var server = new Hapi.Server(internals.port);

    // Register plugins

    // Register routes
    // server.route([
    // ]);

    server.start(function start() {

        console.log('Hello Hapchat!');
    });
}

internals.main();
