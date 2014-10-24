// Load modules

var Fs = require('fs');
var Path = require('path');
var Async = require('async');
var Boom = require('boom');


// Declare internals

var internals = {
    maxAge: 1000 * 60 * 60 * 24 * 5,  // 5 days
    path: Path.join(__dirname, '..', '..', 'static', 'photos')
};


module.exports = {
    handler: function (request, reply) {

        var getFiles = function (next) {

            Fs.readdir(internals.path, next);
        };

        var getStats = function (files, next) {

            var addStats = function (file, next) {

                var filePath = Path.join(internals.path, file);

                Fs.stat(filePath, function (err, stats) {

                    if (err) {
                        return next(err);
                    }

                    var fileparts = file.split('.');
                    var result = {
                        id: fileparts[0],
                        extension: fileparts[1].toLowerCase(),
                        timestamp: stats.ctime.getTime()
                    };

                    next(null, result);
                });
            };

            Async.map(files, addStats, next);
        };

        var sortFiles = function (files, next) {

            files.sort(function (a, b) {

                return b.timestamp - a.timestamp;
            });

            next(null, files);
        };

        var filterFiles = function (files, next) {

            var displayFiles = [];

            var now = new Date().getTime();
            var maxage = now - internals.maxAge;

            for (var i = 0, il = files.length; i < il; ++i) {
                var file = files[i];

                if (file.timestamp > maxage && file.extension === 'png') {
                    displayFiles.push(file);
                }
            }

            next(null, displayFiles);
        };

        Async.waterfall([
            getFiles,
            getStats,
            sortFiles,
            filterFiles
        ], function (err, files) {

            if (err) {
                return reply(Boom.internal(err));
            }

            return reply.view('photos', { files: files });
        });
    }
};
