// Load modules


// Declare internals

var internals = {};


module.exports.login = {
    auth: 'github',
    handler: function (request, reply) {

        if (request.auth.isAuthenticated) {
            request.auth.session.set(request.auth.credentials);
        }

        return reply.redirect('/');
    }
};


module.exports.logout = {
    handler: function (request, reply) {

        request.auth.session.clear();
        
        return reply.redirect('/');
    }
};
