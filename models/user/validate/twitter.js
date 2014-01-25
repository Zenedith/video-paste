var
    config = require("config"),
    User_Validate_Oauth = require(process.env.APP_PATH + "/models/user/validate/oauth").User_Validate_Oauth,
    log = require(process.env.APP_PATH + "/lib/log"),
    secure = require("node-secure");

var User_Validate_Twitter = function () {
    log.debug('User_Validate_Twitter.construct()');

    var
        consumerkey = config.auth.twitter.consumerkey,
        consumersecret = config.auth.twitter.consumersecret,
        baseSite = "";

    User_Validate_Oauth.call(this, consumerkey, consumersecret, baseSite);  //call parent constructor

    if (config.auth.twitter.accesstoken) {
        this.setAccessToken(config.auth.twitter.accesstoken);
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

            if (data.name !== name) {
                return callback(error(605, 'User not authorized on twitter'), null);
            }

            return callback(null, data);
        });
    };

};

User_Validate_Twitter.prototype.renewAccessToken = function (callback) {
    log.debug('User_Validate_Twitter.renewAccessToken()');

    return callback(error(500, 'Unable to authorize twitter account'), null);
};


User_Validate_Twitter.prototype.setAccessToken = function (accessToken) {
    log.debug('User_Validate_Twitter.setAccessToken(' + accessToken + ')');

    if (accessToken) {
        User_Validate_Oauth.prototype.setAccessToken.call(this, accessToken);
        config.auth.twitter.accesstoken = accessToken;
    }
};

User_Validate_Twitter.prototype.__proto__ = User_Validate_Oauth.prototype;


exports.User_Validate_Twitter = User_Validate_Twitter;
secure.secureMethods(exports);
