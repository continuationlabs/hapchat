// Load modules

var Path = require('path');


// Declare internals

var internals = {};


module.exports = {};


module.exports.home = {
    description: 'Home page view for hapchat',
    auth: {
        mode: 'try'
    },
    handler: function (request, reply) {

        reply.view('index');
    }
};


module.exports.uploadView = {
    description: 'View: upload pictures',
    handler: function (request, reply) {

        reply.view('upload');
    }
};

module.exports.stat = function (server) {

    return {
        description: 'Static assets for hapchat',
        auth: false,
        handler: {
            directory: {
                path: Path.join(server.settings.app.root, 'static'),
                index: false
            }
        },
        cache: {
            expiresIn: server.settings.app.oneDay * 10
        }
    }
}


module.exports.login = require('./login');


module.exports.photos = require('./photos');


module.exports.photo = require('./photo');


module.exports.upload = require('./upload');
