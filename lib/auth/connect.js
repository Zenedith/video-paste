var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  auth = require('connect-auth'),
  controller = require(process.env.APP_PATH + "/lib/controller"),
  secure = require("node-secure");

var Auth_Connect = function() {

  this.initApp = function (app) {
    app.use(
      auth({
        strategies:[
          auth.Twitter({consumerKey: config.auth.twitter.consumerkey, consumerSecret: config.auth.twitter.consumersecret}),
          auth.Facebook({appId : config.auth.facebook.appid, appSecret: config.auth.facebook.appsecret, scope: "email", callback: 'http://webapi-video-paste.dotcloud.com/auth/facebook/login'}),
          auth.Google2({appId : config.auth.google.clientid, appSecret: config.auth.google.clientsecret, callback: 'http://webapi-video-paste.dotcloud.com/auth/google/login', requestEmailPermission: true})
          ],
        trace: true
        })
    );

    var route_data = {
      "controller": "login",
      "action": "login",
      "url": "",
      "method":"get",
      "description":"service login",
      "isRegExp" : false
    };

    controller.initRoute(app, route_data, 'auth/:service/login');
  };

  this.updateAccessToken = function(service, req, res) {
    log.debug('Auth_Connect.updateAccessToken(' + service + ')');

    if(req.isAuthenticated()) {
      res.json(req.getAuthDetails());
      console.log('Auth_Connect: update access for ' + service + ': ' + req.session["access_token"]);
    }
    else {
      req.authenticate([service], function(error, authenticated) {
        if(req.isAuthenticated()) {
          console.log('update access for ' + service + ': ' + req.session["access_token"]);

          if (process.env.NODE_ENV === 'development') {
            res.json(req.getAuthDetails());
          }
          else {
            res.render('info', { title: 'Zalogowano pomyślnie do usługi ' + service });
          }
        }
      });
    }
  };
};

exports.Auth_Connect = Auth_Connect;
secure.secureMethods(exports);
