var
    config = require("config"),
    User_Validate_Oauth = require(process.env.APP_PATH + "/models/user/validate/oauth").User_Validate_Oauth,
    log = require(process.env.APP_PATH + "/lib/log"),
    secure = require("node-secure");

var User_Validate_Live = function () {
    log.debug('User_Validate_Live.construct()');

    var
        clientId = config.auth.live.appid,
        clientSecret = config.auth.live.appsecret,
        baseSite = "";

    User_Validate_Oauth.call(this, clientId, clientSecret, baseSite);  //call parent constructor

    if (config.auth.live.accesstoken) {
        this.setAccessToken(config.auth.live.accesstoken);
    }

    this.isValid = function (id, name, fist_name, last_name, callback) {
        log.debug('User_Validate_Live.isValid(' + id + ',' + name + ',' + fist_name + ',' + last_name + ')');

        //call parent
        User_Validate_Oauth.prototype.isValid.call(this, 'https://apis.live.net/v5.0/' + id, function (err, data) {

            if (err) {
                var
                    msg = err.data || err.msg;

                log.debug('User_Validate_Live.isValid FAILELD: ' + msg);
                return callback(error(605, 'User not authorized on windows live'), null);
            }

            //do json decode after we know that is no err
            data = JSON.parse(data);

            if (data.name !== name || data.first_name !== fist_name || data.last_name !== last_name) {
                return callback(error(605, 'User not authorized on windows live'), null);
            }

            return callback(null, data);
        });
    };

};

User_Validate_Live.prototype.renewAccessToken = function (callback) {
    log.debug('User_Validate_Live.renewAccessToken()');

    return callback(error(500, 'Unable to authorize microsoft live account'), null);
};


User_Validate_Live.prototype.setAccessToken = function (accessToken) {
    log.debug('User_Validate_Live.setAccessToken(' + accessToken + ')');

    if (accessToken) {
        User_Validate_Oauth.prototype.setAccessToken.call(this, accessToken);
        config.auth.live.accesstoken = accessToken;
    }
};

User_Validate_Live.prototype.__proto__ = User_Validate_Oauth.prototype;


exports.User_Validate_Live = User_Validate_Live;
secure.secureMethods(exports);
