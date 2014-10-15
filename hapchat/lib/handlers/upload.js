// Load modules

var Async = require('async');
var Uuid = require('node-uuid');
var Path = require('path');
var Hoek = require('hoek');
var Boom = require('boom');
var Fs = require('fs');

//var Hapami = require('../hapami')


// Declare internals

var internals = {};


module.exports = {
    handler: function (request, reply) {

        var db = request.server.settings.app.db;
        var photoId = Uuid.v4();
        var userId = Hoek.reach(request, 'server.auth.credentials.SOMEID');

        var writeToDb = function (next) {

            db.get('hapchat', function (err, hapchat) {

                if (err) {
                    hapchat = [];
                }

                hapchat.push({
                    id: photoId,
                    user: userId,
                    date: new Date()
                });

                db.put('hapchat', hapchat, next);
            });
        };

        var writeToFile = function (next) {

            var path = Path.join(request.server.settings.app.root, 'static','photos', photoId + '.png');
            var image = request.payload.image.replace(/^data:image\/png;base64,/, '');

            Fs.writeFile(path, image, { encoding: 'base64' }, next);
        };

        // broadcast photo information
        var broadcastInformation = function (next) {

            request.server.app.broadcast(photoId, next);
        };

        Async.parallel([
            writeToDb,
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
