var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  secure = require("node-secure");

var Login_Controller = {
  updateAccessToken: function(type, req, res) {
    log.debug('Login_Controller.updateAccessToken(' + type + ')');

    if(req.isAuthenticated()) {
      res.json(req.getAuthDetails());
      console.log('update access for ' + type + ': ' + req.session["access_token"]);
    }
    else {
      req.authenticate([type], function(error, authenticated) {
        if(req.isAuthenticated()) {
          console.log('update access for ' + type + ': ' + req.session["access_token"]);
          res.json(req.getAuthDetails());
        }
      });
    }
  },
  google: function(req, res) {
    Login_Controller.updateAccessToken('google2', req, res);
  },
  facebook: function(req, res) {
    Login_Controller.updateAccessToken('facebook', req, res);
  },
  twitter: function(req, res) {
    Login_Controller.updateAccessToken('twitter', req, res);
  },
  live: function(req, res) {
    Login_Controller.updateAccessToken('live', req, res);
  }
};



module.exports = Login_Controller;
secure.secureMethods(module.exports);
