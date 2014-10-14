// Load modules

module.exports = {};

module.exports.home = function (request, reply) {

    reply.view('index');
};

module.exports.photo = function (request, reply) {

    reply.view('photocap');
};

module.exports.upload = require('./upload');
