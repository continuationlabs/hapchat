// Load modules

var Ws = require('ws');
var Uuid = require('node-uuid')


// Declare internals

var internals = {
    sockets: {},
    server: null
};

internals.broadcast = function (msg, callback) {

    var err = null;
    var keys = Object.keys(internals.sockets);
    for (var i = 0, il = keys.length; i < il; ++i) {
        var socket = internals.sockets[keys[i]];
        socket.send(msg);
    }
    callback(err);
};


internals.register = function (socket) {

    var key = Uuid.v4();
    internals.sockets.key = socket;

    return key;
};

internals.unregister = function (key) {

    delete internals.sockets.key;
};


module.exports.init = function (server) {

    var ws = internals.server = new Ws.Server({ server: server.listener });

    ws.on('connection', function (socket) {

        var id = internals.register(socket);
        socket.on('close', function () {

            internals.unregister(id);
        });
    });

    server.app.broadcast = internals.broadcast;
};
