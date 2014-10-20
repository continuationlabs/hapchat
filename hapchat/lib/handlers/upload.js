// Load modules

var Async = require('async');
var Uuid = require('node-uuid');
var Path = require('path');
var Hoek = require('hoek');
var Boom = require('boom');
var Fs = require('fs');


// Declare internals

var internals = {};


module.exports = {
    auth: 'session',
    handler: function (request, reply) {

        var photoId = Uuid.v4();
        var writeToFile = function (next) {

            var path = Path.join(request.server.settings.app.root, 'static','photos', photoId + '.png');
            var image = request.payload.image.replace(/^data:image\/png;base64,/, '');

            Fs.writeFile(path, image, { encoding: 'base64' }, next);
        };

        // broadcast photo information
        var broadcastInformation = function (next) {

            var ws = request.server.app.ws;
            ws.broadcast(photoId);

            return next(null);
        };

        Async.series([
            writeToFile,
            broadcastInformation
        ], function (err) {

            if (err) {
                return reply(Boom.internal(err));
            }

            return reply().code(200);
        });
    }
};
