var
  OAuth = require("oauth").OAuth2,
  config = require("config"),
  log = require(process.env.APP_PATH + "/lib/log"),
  secure = require("node-secure");

var User_Validate_Oauth = function (clientId, clientSecret, baseSite, authorizePath, accessTokenPath) {
  log.debug('User_Validate_Oauth.construct()');

//  console.log(clientId, clientSecret, baseSite, authorizePath, accessTokenPath);

  this.accessToken = '';
  this.baseSite = baseSite;
  this.oAuth = new OAuth(clientId, clientSecret, baseSite, authorizePath, accessTokenPath);
};

User_Validate_Oauth.prototype.renewAccessToken = function (callback) {
  //TODO call cron to update /auth/:service/login
  access_token = null;
  return callback(null, access_token);
};

User_Validate_Oauth.prototype.setAccessToken = function(accessToken) {
  log.debug('User_Validate_Oauth.setAccessToken(' + accessToken + ')');

  if (accessToken) {
    this.accessToken = accessToken;
  }
};

User_Validate_Oauth.prototype.isValid = function (path, callback) {
  log.debug('User_Validate_Oauth.isValid(' + path + ')');

  var
    _this = this,
    main_call = function (accessToken) {

      _this.oAuth.getProtectedResource(path, accessToken, function (err2, data) {

        if (err2) {
          return callback(err2, null);
        }

        return callback(null, data);
      });
    };


  if (!this.accessToken) {
    this.renewAccessToken(function (err, accessToken) {

      if (err) {
        return callback(err, null);
      }

      _this.setAccessToken(accessToken);
      return main_call(accessToken);

    });
  }
  else {
    return main_call(this.accessToken);
  }

};

exports.User_Validate_Oauth = User_Validate_Oauth;
secure.secureMethods(exports);
