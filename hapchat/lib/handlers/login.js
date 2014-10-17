// Load modules


// Set Internals

var internals = {
    redirectTo: '/upload'
};


module.exports.facebook = {
    auth: 'facebook',
    handler: function (request, reply) {

        if (request.auth.isAuthenticated) {
            request.auth.session.set(request.auth.credentials);
        }

        return reply.redirect(internals.redirectTo);
    }
};

module.exports.github = {
    auth: 'github',
    handler: function (request, reply) {

        if (request.auth.isAuthenticated) {
            request.auth.session.set(request.auth.credentials);
        }

        return reply.redirect(internals.redirectTo);
    }
};
