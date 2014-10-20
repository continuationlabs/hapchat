// Load modules

module.exports = {};


module.exports.home = function (request, reply) {

    reply.view('index');
};


module.exports.uploadView = {
    auth: 'session',
    handler: function (request, reply) {

        reply.view('upload');
    }
};


module.exports.login = require('./login');


module.exports.photos = require('./photos');


module.exports.photo = require('./photo');


module.exports.upload = require('./upload');
