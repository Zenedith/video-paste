var
  config = require("config"),
//  User_Validate_Oauth = require(process.env.APP_PATH + "/models/user/validate/oauth").User_Validate_Oauth,
  http = require('http'),
  log = require(process.env.APP_PATH + "/lib/log"),
  secure = require("node-secure");

var User_Validate_Google = function () {
  log.debug('User_Validate_Google.construct()');

  //version without oauth (SIMPLER)
  this.isValid = function (id, name, fist_name, last_name, callback) {
    log.debug('User_Validate_Google.isValid(' + id + ',' + name + ',' + fist_name + ',' + last_name + ')');

    var options = {
        host: 'www-opensocial.googleusercontent.com',
        port: 80,
        path: '/api/people/' + id,
        method: 'GET'
     },
     req = http.get(options, function(response) {
       var data = '';
       response.on('data', function (chunk) {
         data += chunk;
       });

       response.on('end', function () {
         if (response.statusCode !== 200) {
           return callback(error(605, 'User not authorized on google'), null);
         }

         data = JSON.parse(data);

         if (data.entry.name.formatted !== name || data.entry.name.givenName !== fist_name || data.entry.name.familyName !== last_name) {
           return callback(error(605, 'User not authorized on google'), null);
         }

         return callback(null, data);
       });
     });
   };

//  var
//    clientId = config.auth.google.clientid,
//    clientSecret = config.auth.google.clientsecret,
//    baseSite = "",
//    authorizePath = "https://accounts.google.com/o/oauth2/auth",
//    accessTokenPath = "https://accounts.google.com/o/oauth2/token";
//
//  User_Validate_Oauth.call(this, clientId, clientSecret, baseSite, authorizePath, accessTokenPath);  //call parent constructor
//
//  if (config.auth.google.accesstoken) {
//    this.setAccessToken(config.auth.google.accesstoken);
//  }

//  //version with oauth (TODO how to get custom user id profile?!)
//  this.isValid = function (id, name, fist_name, last_name, callback) {
//    log.debug('User_Validate_Google.isValid(' + id + ',' + name + ',' + fist_name + ',' + last_name + ')');
//
//    //call parent
//    User_Validate_Oauth.prototype.isValid.call(this, 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json', function (err, data) {
//
//      console.log(err, data);
//
//      if (err) {
//        log.debug('User_Validate_Google.isValid FAILELD: ' + err.data);
//        return callback(error(605, 'User not authorized on google'), null);
//      }
//
//      //do json decode after we know that is no err
//      data = JSON.parse(data);
//
//      if (data.name !== name || data.given_name !== fist_name || data.family_name !== last_name) {
//        return callback(error(605, 'User not authorized on facebook'), null);
//      }
//
//      return callback(null, data);
//    });
//  };

};

//User_Validate_Google.prototype.__proto__ = User_Validate_Oauth.prototype;


exports.User_Validate_Google = User_Validate_Google;
secure.secureMethods(exports);
