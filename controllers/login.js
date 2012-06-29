var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  Auth_Connect = require(process.env.APP_PATH + "/lib/auth/connect").Auth_Connect,
  authConnect = new Auth_Connect(),
  secure = require("node-secure");

var Login_Controller = {
  login: function(req, res) {

    var
      service = req.params.service;

    if (service === 'google') {
      service = 'google2';
    }

    authConnect.updateAccessToken(service, req, res);
  }
};



module.exports = Login_Controller;
secure.secureMethods(module.exports);
