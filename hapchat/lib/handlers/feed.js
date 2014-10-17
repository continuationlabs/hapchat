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


module.exports = {
    auth: 'session',
    handler: function (request, reply) {

        var getFiles = function (next) {

            Fs.readdir(internals.path, next)
        };

        var getStats = function (files, next) {

            var filestats = [];

            var addStats = function (file, next) {

                var filePath = Path.join(internals.path, file);
                Fs.stat(filePath, function (err, stats) {

                    var fileparts = file.split('.');
                    filestats.push({
                        id: fileparts[0],
                        extension: fileparts[1],
                        timestamp: stats.ctime.getTime()
                    });

                    next(err);
                });
            };

            Async.each(files, addStats, function (err) {

                next(err, filestats);
            });
        };

        var sortFiles = function (files, next) {

            files.sort(function (a, b) {

                return (a.timestamp < b.timestamp);
            });

            next(null, files);
        };

        var filterFiles = function (files, next) {

            var displayFiles = [];

            var now = new Date().getTime();
            var maxage = now - internals.maxAge;

            for (var i = 0, il = files.length; i < il; ++i) {
                var file = files[i];
                if (file.timestamp > maxage) {
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

            return reply.view('feed', { files: files });
        });
    }
}
