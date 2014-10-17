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

    // Register methods
    Lib.registerMethods(server);

    // Server extension points
    server.ext('onPreResponse', function (request, reply) {

        if (request.response.variety === 'view') {
            request.response.source.context = Hoek.applyToDefaults(server.settings.app.globalContext, request.response.source.context || {});
            request.response.source.context.path = request.path;

            server.methods.getNav(request.auth.isAuthenticated, function (error, result) {

                request.response.source.context.nav = result;
                reply();
            });
        }
        else {
            reply();
        }
    });

    // Register plugins
    server.pack.register([
        HapiAuthCookie,
        Bell
    ], function (err) {

        // Set session
        server.auth.strategy('session', 'cookie', {
            password: 'cookie_encryption_password',
            cookie: 'sid',
            isSecure: false,
            redirectTo: '/login',
            ttl: server.app.oneDay
        });

        // Facebook third party auth
        server.auth.strategy('facebook', 'bell', {
            provider: 'facebook',
            password: 'cookie_encryption_password',
            clientId: '966006790093008',
            clientSecret: '8473cd8260b4b60671236784b5c729b8',
            isSecure: false
        });

        // Github third party auth
        server.auth.strategy('github', 'bell', {
            provider: 'github',
            password: 'cookie_encryption_password',
            clientId: 'd40df1c0836ce9f1ca10',
            clientSecret: '1916660d600d84974d27911b1fe7983c7946cd8b',
            isSecure: false
        });
        

        // Register routes
        Lib.registerRoutes(server);


        // Start the server
        server.start(function start() {

            console.log('Hapchat started at ' + server.info.uri);
        });
    });
};

internals.main();
