// Load modules
var Bell = require('bell');
var HapiAuthCookie = require('hapi-auth-cookie');
var Path = require('path');
var Hapi = require('hapi');
var Lib = require('./lib');
var Hoek = require('hoek');
var Package = require('./package.json');


// Declare internals

var internals = {
    port: process.env.PORT || 8000
};


internals.main = function main() {

    // Create required directories before anything else is done
    Lib.initPaths(__dirname);

    var server = new Hapi.Server(internals.port, {
        app: {
            oneDay: 86400000,
            root: __dirname,
            db: Lib.data.initDb(),
            globalContext: {
                name: 'HapChat',
                year: new Date().getFullYear(),
                version: Package.version
            }
        }
    });

    // Register views
    server.views({
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'static', 'views'),
        layoutPath: Path.join(__dirname, 'static', 'views', 'layout'),
        layout: true,
        layoutKeyword: 'partial'
    });

    // Register plugins

    // Register methods
    Lib.registerMethods(server);

    // Server extension points
    server.ext('onPreResponse', function (request, reply) {

        if (request.response.variety === 'view') {
            request.response.source.context = Hoek.applyToDefaults(server.settings.app.globalContext, request.response.source.context || {});
            request.response.source.context.path = request.path;
console.log(':: AUTH ::', request.auth)
            server.methods.getNav(request.auth.isAuthenticated, function (error, result) {

                request.response.source.context.nav = result;
                reply();
            });
        }
        else {
            reply();
        }
    });

    // Register bell with the server
    server.pack.register(Bell, function (err) {

        // Declare an authentication strategy using the bell scheme
        // with the name of the provider, cookie encryption password,
        // and the OAuth client credentials.

        var provider = Bell.providers.facebook();

        server.auth.strategy('facebook', 'bell', {
            provider: provider,
            password: 'cookie_encryption_password',
            clientId: '966006790093008',
            clientSecret: '8473cd8260b4b60671236784b5c729b8',
            isSecure: false     // Terrible idea but required if not using HTTPS
        });

        server.pack.register(HapiAuthCookie, function (err) {

            server.auth.strategy('session', 'cookie', {
                password: 'secret',
                cookie: 'sid-example',
                redirectTo: '/login',
                isSecure: false
            });

            // Register routes
            Lib.registerRoutes(server);


            // Start the server
            server.start(function start() {

                console.log('Hapchat started at ' + server.info.uri);
            });
        });
    });
};

internals.main();
