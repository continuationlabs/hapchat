var Async = require('async');
var Uuid = require('node-uuid');
var Path = require('path');
var Hoek = require('hoek');
var Boom = require('boom');
var Fs = require('fs');

var Db = require('../data');
//var Hapami = require('../hapami')


module.exports = {
    description: 'Photo uploading endpoint',
    payload: {
        output: 'stream'
    },
    handler: function (request, reply) {

        var photoId = Uuid.v4();
        var userId = Hoek.reach(request, 'server.auth.credentials.SOMEID');


        var writeToDb = function (next) {

            Db.get('hapchat', function (err, hapchat) {

                if (err) {
                    hapchat = [];
                }

                hapchat.push({
                    id: photoId,
                    user: userId,
                    date: new Date()
                });

                Db.put('hapchat', hapchat, next);
            });
        };

        var writeToFile = function (next) {

            var path = Path.join(__dirname, '../../public/photos', photoId + '.jpg')

            var err = null;

            try {
                request.payload.pipe(Fs.createWriteStream(path));
            }
            catch (e) {
                err = e;
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
