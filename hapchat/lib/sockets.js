// Load modules

var Ws = require('ws');
var Uuid = require('node-uuid')


// Declare internals

var internals = {
    server: null
};


module.exports.init = function (server) {

    var ws = internals.server = new Ws.Server({ server: server.listener });

    ws.broadcast = function (data) {

        var keys = Object.keys(this.clients);
        for (var i = 0, il = keys.length; i < il; ++i) {
            var key = keys[i];
            var socket = this.clients[i];

            socket.send(data);
        }
    };

    server.app.ws = ws;
};
