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
    description: 'Photo uploading endpoint',
    handler: function (request, reply) {

        //console.log(request.payload)

        //request.raw.req.pipe(process.stdout);

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

            var path = Path.join(__dirname, '../../static/photos', photoId + '.png');
            var file = Fs.createWriteStream(path);

            var err = null;
//request.raw.req.pipe(process.stdout);
            try {
                //request.payload.image.pipe(Fs.createWriteStream(path));
                //request.raw.req.pipe(Fs.createWriteStream(path));
                request.payload.image.pipe(file);
            }
            catch (e) {
                err = e;
                console.error(e);
            }

            next(err);
        };

        // broadcast photo information
        var broadcastInformation = function (next) {

            next(null);
        };

        Async.parallel([
            writeToDb,
            writeToFile,
            broadcastInformation
        ], function (err) {

            if (err) {
                return reply(Boom.internal(err));
            }

            return reply('OK');
        });
    }
};
