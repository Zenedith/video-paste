var
    config = require('config'),
    log = require(process.env.APP_PATH + "/lib/logger").logger,
    authom = require('authom'),
    secure = require("node-secure");

var Auth_Authom = function () {

    this.initApp = function (app) {
        log.debug('Auth_Authom.initApp()');

        authom.createServer({
            service: "facebook",
            id: config.auth.facebook.appid,
            secret: config.auth.facebook.appsecret,
            scope: ['email']
        });

        authom.createServer({
            service: "google",
            id: config.auth.google.clientid,
            secret: config.auth.google.clientsecret,
            scope: ""
        });

        authom.createServer({
            service: "twitter",
            id: config.auth.twitter.consumerkey,
            secret: config.auth.twitter.consumersecret
        });

        authom.createServer({
            service: "windowslive",
            id: config.auth.live.clientid,
            secret: config.auth.live.clientsecret,
            scope: "wl.basic"
        });

        authom.on("auth", function (req, res, data) {
            switch (data.service) {
                case "facebook":
                    config.auth.facebook.accesstoken = data.token;
                    break;
                case "google":
                    config.auth.google.accesstoken = data.token;
                    break;
                case "twitter":
                    config.auth.twitter.accesstoken = data.token;
                    config.auth.twitter.accesstokensecret = data.secret;
                    break;
                case "windowslive":
                    config.auth.live.accesstoken = data.token;
                    break;
            }

            if (process.env.NODE_ENV === 'development') {
                res.json(data);
            }
            else {
                res.render('info', { title: 'Zalogowano pomyślnie do usługi ' + data.service });
            }
        });

        authom.on("error", function (req, res, data) {
            // called when an error occurs during authentication
            console.log('on error');
            res.render('info', { title: data.error });
        });

        app.get('/auth/:service/login', authom.app);
        log.debug('initialized get /auth/:service/login');
    };

    this.updateAccessToken = function (type, req, res) {
        log.debug('Auth_Authom.updateAccessToken(' + type + ')');

        if (req.isAuthenticated()) {
            res.json(req.getAuthDetails());
            console.log('Auth_Authom: update access for ' + type + ': ' + req.session.access_token);
        }
        else {
            req.authenticate([type], function (error, authenticated) {

                if (req.isAuthenticated()) {
                    console.log('update access for ' + type + ': ' + req.session.access_token);
                    res.json(req.getAuthDetails());
                }
            });
        }
    };
};

exports.Auth_Authom = Auth_Authom;
secure.secureMethods(exports);
