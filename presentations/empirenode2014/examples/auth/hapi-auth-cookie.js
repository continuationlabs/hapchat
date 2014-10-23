// Load modules
var Hapi = require('hapi');
var AuthCookie = require('hapi-auth-cookie');
var Joi = require('joi');

// User database
var users = {
    empire: {
        password: 'node',
        name: 'Empire Node User'
    }
};

// Handlers
var validate = function (request, reply) {

    var username = request.payload.username;
    var password = request.payload.password;

    var user = users[username];
    var isValid = user && user.password === password;

    if (!isValid) {
        return reply().redirect('/login');
    }

    var credentials = { name: user.name } // Will be accessible in request.auth.credentials

    request.auth.session.set(credentials);
    return reply('Logged In');
};

var publicHandler = function (request, reply) {

    reply('Everyone can see this...');
};

var privateHandler = function (request, reply) {

    reply('Welcome ' + request.auth.credentials.name);
};

var loginPage = function (request, reply) {

    var htmlForm = '<form method="post">' +
                   '    <p>' +
                   '        Username: <input type="text" name="username" /><br />' +
                   '        Password: <input type="password" name="password" />' +
                   '    </p>' +
                   '    <p><input type="submit" value="login" /></p>' +
                   '</form>';

    reply(htmlForm);
};

var logout = function (request, reply) {

    request.auth.session.clear();
    reply('Logged out');
};

// Create server
var server = new Hapi.Server(8187);

// Load plugins
server.pack.register(AuthCookie, function (err) {

    // Configure auth scheme
    server.auth.strategy('YourCookieAuth', 'cookie', {
        password: 'PasswordUsedToEncryptCookie',
        cookie: 'NameOfCookie',
        redirectTo: '/login',
        isSecure: false
    });

    // Configure routes after plugins are loaded
    server.route({
        method: 'GET',
        path: '/public',
        handler: publicHandler
    });

    // Configure protected routes by setting auth
    server.route({
        method: 'GET',
        path: '/private',
        handler: privateHandler,
        config: {
            auth: 'YourCookieAuth'
        }
    });

    // Login page
    server.route({
        method: 'GET',
        path: '/login',
        handler: loginPage
    });

    // Logout
    server.route({
        method: 'GET',
        path: '/logout',
        handler: logout,
        config: {
            auth: 'YourCookieAuth'
        }
    });

    // Login form post
    server.route({
        method: 'POST',
        path: '/login',
        handler: validate,
        config: {
            validate: {
                payload: {
                    username: Joi.string().required(),
                    password: Joi.string().required()
                }
            }
        }
    });

    // Start server
    server.start(function () { console.log('Started...'); });
});
