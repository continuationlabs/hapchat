// Load modules

module.exports = {};

module.exports.home = function (request, reply) {

    reply.view('index');
};

module.exports.upload = require('./upload');
