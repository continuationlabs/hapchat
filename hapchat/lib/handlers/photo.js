// Load modules
var Fs = require('fs');
var Joi = require('joi');


// Declare internals
var internals = {};

module.exports = {
    auth: 'session',
    handler: function (request, reply) {

        var photoId = request.params.photoId;

        reply.view('photo', {
            file: {
                href: '/static/photos/' + photoId + '.png'
            }
        });
    },
    validate: {
        params: {
            photoId: Joi.string().regex(/([\w\d]+-){4}[\w\d]+/)
        }
    }
};