var
  OAuth = require("oauth").OAuth2,
  config = require("config"),
  log = require(process.env.APP_PATH + "/lib/log"),
  secure = require("node-secure");

var User_Validate_Facebook = function () {
  log.debug('User_Validate_Facebook.construct()');

  this.oAuth = new OAuth(config.auth.appid, config.auth.appsecret,  "https://graph.facebook.com");

  this.isValid = function (id, name, fist_name, last_name, callback) {
    log.debug('User_Validate_Facebook.isValid(' + id + ')');
    this.oAuth.getProtectedResource('https://graph.facebook.com/' + id, config.auth.accesstoken, function (err, data) {

      //TODO access token is wrong...get new!

      if (err) {
        log.debug('User_Validate_Facebook.isValid FAIELD: ' + err.data);
        return callback(error(605, 'User not authorized on facebook'), null);
      }

      //do json decode after we know that is no err
      data = JSON.parse(data);

      if (data.name !== name || data.first_name !== fist_name || data.last_name !== last_name) {
        return callback(error(605, 'User not authorized on facebook'), null);
      }

      return callback(null, data);
    });
  };

//  this.renewAccessToken = function (callback) {
//    this.oAuth.getOAuthAccessToken(true, {}, function(err, access_token, refresh_token ){
//      return callback(err, access_token);
//    });
//  };

};

exports.User_Validate_Facebook = User_Validate_Facebook;
secure.secureMethods(exports);
