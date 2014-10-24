// Load modules

var Fs = require('fs');
var Path = require('path');
var Async = require('async');
var Boom = require('boom');
var Hoek = require('hoek');
var Uuid = require('node-uuid');


// Declare internals

var internals = {};


module.exports = {
    handler: function (request, reply) {

        var photoId = Uuid.v4();

        var writeToFile = function (next) {

            var path = Path.join(request.server.settings.app.root, 'static', 'photos', photoId + '.png');
            var image = request.payload.image.replace(/^data:image\/png;base64,/, '');

            Fs.writeFile(path, image, { encoding: 'base64' }, next);
        };

        // Broadcast photo information
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

            console.info('%s successfully written to the file system.', photoId);

            return reply().code(200);
        });
    }
};
