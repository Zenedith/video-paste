var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  auth = require('connect-auth')
  secure = require("node-secure");

var Auth_Connect = function() {

  this.initApp = function (app) {
    app.use(
      auth({
        strategies:[
          auth.Twitter({consumerKey: config.auth.twitter.consumerkey, consumerSecret: config.auth.twitter.consumersecret}),
          auth.Facebook({appId : config.auth.facebook.appid, appSecret: config.auth.facebook.appsecret, scope: "email", callback: 'http://localhost:3001/auth/facebook_callback'}),
          auth.Google2({appId : config.auth.google.clientid, appSecret: config.auth.google.clientsecret, callback: 'http://localhost:3001/auth/google/login', requestEmailPermission: true})
        ],
      trace: true
      })
    );
  };

  this.updateAccessToken = function(type, req, res) {
    log.debug('Auth_Connect.updateAccessToken(' + type + ')');

    if(req.isAuthenticated()) {
      res.json(req.getAuthDetails());
      console.log('Auth_Connect: update access for ' + type + ': ' + req.session["access_token"]);
    }
    else {
      req.authenticate([type], function(error, authenticated) {
        if(req.isAuthenticated()) {
          console.log('update access for ' + type + ': ' + req.session["access_token"]);
          res.json(req.getAuthDetails());
        }
      });
    }
  };
}

exports.Auth_Connect = Auth_Connect;
secure.secureMethods(exports);
