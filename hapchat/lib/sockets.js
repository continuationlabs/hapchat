// Load modules

var Uuid = require('node-uuid')
var Ws = require('ws');


// Declare internals

var internals = {};


module.exports.init = function (server) {

    var ws = new Ws.Server({ server: server.listener });

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
