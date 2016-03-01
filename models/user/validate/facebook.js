var
    config = require("config"),
    User_Validate_Oauth = require(process.env.APP_PATH + "/models/user/validate/oauth").User_Validate_Oauth,
    log = require(process.env.APP_PATH + "/lib/logger").logger,
    secure = require("node-secure");

var User_Validate_Facebook = function () {
    log.debug('User_Validate_Facebook.construct()');

    var
        clientId = config.auth.facebook.appid,
        clientSecret = config.auth.facebook.appsecret,
        baseSite = "https://graph.facebook.com";

    User_Validate_Oauth.call(this, clientId, clientSecret, baseSite);  //call parent constructor

    if (config.auth.facebook.accesstoken) {
        this.setAccessToken(config.auth.facebook.accesstoken);
    }

    this.isValid = function (id, name, fist_name, last_name, callback) {
        log.debug('User_Validate_Facebook.isValid(' + id + ',' + name + ',' + fist_name + ',' + last_name + ')');

        //call parent
        User_Validate_Oauth.prototype.isValid.call(this, baseSite + '/' + id, function (err, data) {

            if (err) {
                log.debug('User_Validate_Facebook.isValid FAILELD: ' + err.data);
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
};

User_Validate_Facebook.prototype.setAccessToken = function (accessToken) {
    log.debug('User_Validate_Facebook.setAccessToken(' + accessToken + ')');

    if (accessToken) {
        User_Validate_Oauth.prototype.setAccessToken.call(this, accessToken);
        config.auth.facebook.accesstoken = accessToken;
    }
};

User_Validate_Facebook.prototype.renewAccessToken = function (callback) {
    log.debug('User_Validate_Facebook.renewAccessToken()');

    return callback(error(500, 'Unable to authorize facebook account'), null);
};


User_Validate_Facebook.prototype.__proto__ = User_Validate_Oauth.prototype;


exports.User_Validate_Facebook = User_Validate_Facebook;
secure.secureMethods(exports);
