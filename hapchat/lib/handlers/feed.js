// Load modules
var Boom = require('boom');
var Fs = require('fs');
var Path = require('path');
var Async = require('async');


// Declare internals
var internals = {
    maxAge: 1000 * 60 * 60 * 24 * 5,  // 5 days
    path: Path.join(__dirname, '../../static/photos')
};


internals.getFiles = function (next) {

    Fs.readdir(internals.path, next)
};


module.exports = {
    handler: function (request, reply) {

        var getFiles = function (next) {

            Fs.readdir(internals.path, next)
        };

        var getStats = function (files, next) {

            var filestats = [];

            var addStats = function (file, next) {

                var filePath = Path.join(internals.path, file);
                Fs.stat(filePath, function (err, stats) {

                    filestats.push({
                        name: file,
                        timestamp: stats.atime.getTime()
                    });

                    next(err);
                });
            };

            Async.each(files, addStats, function (err) {

                next(err, filestats);
            });
        };

        var sortFiles = function (files, next) {

            // Do some sorting ...

            next(null, files);
        };

        var filterFiles = function (files, next) {

            var oldFiles = [];
            var displayFiles = [];

            var now = new Date().getTime();
            var maxage = now - internals.maxAge;

            var filterFile = function (file, next) {

                if (file.timestamp < maxage) {
                    oldFiles.push(file.name);
                }
                else {
                    displayFiles.push(file.name);
                }

                next(null);
            };

            Async.each(files, filterFile, function (err) {

                next(err, oldFiles, displayFiles);
            });
        };

        var deleteFiles = function (oldFiles, displayFiles, next) {

            // Delete old files

            next(null, displayFiles);
        };

        Async.waterfall([
            getFiles,
            getStats,
            sortFiles,
            filterFiles,
            deleteFiles
        ], function (err, files) {

            if (err) {
                return reply(Boom.internal(err));
            }

            return reply.view('feed', { files: files });
        });
    }
}
