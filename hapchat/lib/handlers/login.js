// Load modules


// Set Internals

var internals = {
    redirectTo: '/upload'
};


module.exports = {
    auth: 'facebook',
    handler: function (request, reply) {

        if (request.auth.isAuthenticated) {
            request.auth.session.set(request.auth.credentials);
        }

        return reply.redirect(internals.redirectTo);
    }
};
