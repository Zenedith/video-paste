var
  config = require("config"),
  User_Validate_Oauth = require(process.env.APP_PATH + "/models/user/validate/oauth").User_Validate_Oauth,
  log = require(process.env.APP_PATH + "/lib/log"),
  secure = require("node-secure");

var User_Validate_Twitter = function () {
  log.debug('User_Validate_Twitter.construct()');

  var
    clientId = config.auth.facebook.appid,
    clientSecret = config.auth.facebook.appsecret,
    baseSite = "";

  User_Validate_Oauth.call(this, clientId, clientSecret, baseSite);  //call parent constructor

  if (config.auth.facebook.accesstoken) {
    this.setAccessToken(config.auth.facebook.accesstoken);
  }

  this.isValid = function (id, name, callback) {
    log.debug('User_Validate_Twitter.isValid(' + id + ',' + name + ')');

    //call parent
    User_Validate_Oauth.prototype.isValid.call(this, 'https://api.twitter.com/1/users/show.json?user_id=' + id, function (err, data) {

      if (err) {
        log.debug('User_Validate_Twitter.isValid FAILELD: ' + err.data);
        return callback(error(605, 'User not authorized on twitter'), null);
      }

      //do json decode after we know that is no err
      data = JSON.parse(data);
      console.log(data);

      if (data.name !== name) {
        return callback(error(605, 'User not authorized on twitter'), null);
      }

      return callback(null, data);
    });
  };

};

User_Validate_Twitter.prototype.__proto__ = User_Validate_Oauth.prototype;


exports.User_Validate_Twitter = User_Validate_Twitter;
secure.secureMethods(exports);
