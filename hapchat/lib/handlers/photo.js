// Load modules

var Fs = require('fs');
var Joi = require('joi');


// Declare internals

var internals = {};


module.exports = {
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
            photoId: Joi.string().guid()
        }
    }
};