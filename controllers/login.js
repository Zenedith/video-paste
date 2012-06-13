var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  Auth_Connect = require(process.env.APP_PATH + "/lib/auth/connect").Auth_Connect,
  authConnect = new Auth_Connect(),
  secure = require("node-secure");

var Login_Controller = {
  google: function(req, res) {
    authConnect.updateAccessToken('google2', req, res);
  },
  facebook: function(req, res) {
    authConnect.updateAccessToken('facebook', req, res);
  },
  twitter: function(req, res) {
    authConnect.updateAccessToken('twitter', req, res);
  },
  live: function(req, res) {
    authConnect.updateAccessToken('live', req, res);
  }
};



module.exports = Login_Controller;
secure.secureMethods(module.exports);
