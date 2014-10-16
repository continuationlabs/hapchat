// Load modules


// Set Internals

var internals = {};


module.exports = {
    auth: 'facebook',
    handler: function (request, reply) {

        if (request.auth.isAuthenticated) {
            request.auth.session.set(request.auth.credentials);
        }

        reply.redirect('/');
    }
};
