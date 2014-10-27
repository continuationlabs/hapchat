var Fs = require('fs');
var Path = require('path');
var Cheerio = require('cheerio');
var Async = require('async');

var internals = {
  path: process.cwd()
};
console.info('Building slide deck...');
var gettemplate = function (callback) {

    Fs.readFile(Path.join(internals.path, 'bin', 'template.html'), {
        encoding: 'utf-8'
    }, function (err, result) {

        if (err) {
            return callback(err);
        }

        callback(null, Cheerio.load(result));
    });
};

var buildSlides = function (body, callback) {

    Fs.readdir(Path.join(internals.path, 'html'), function (err, files) {

        if (err) {
            return callback(err);
        }

        Async.eachSeries(files, function (item, next) {

            Fs.readFile(Path.join(internals.path, 'html', item), { encoding: 'utf-8'} , function (err, result) {

                if (err) {
                    return next(err);
                }

                var $ = Cheerio.load(result);

                var slides = $('div.slides>section');
                slides.find('div').removeAttr('style');
                slides.find('div').removeAttr('class');

                body('#deck').append(slides);
                next();

            });
        }, function (err) {

            if (err) {
                return callback(err);
            }

            callback(null, body);
        });
    });
};

var writeFile = function (body, next) {

    Fs.writeFile(Path.join(internals.path, 'html','index.html'), body('html'), next);
};

Async.waterfall([gettemplate, buildSlides, writeFile], function (err) {

    if (err) {
        console.log(err);
        return process.exit(1);
    }

    console.info('Slide deck built into ' + Path.join(internals.path, 'html','index.html'));

    process.exit(0);
});