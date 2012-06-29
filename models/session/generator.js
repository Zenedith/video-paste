var
  log = require(process.env.APP_PATH + "/lib/log"),
  crypto = require('crypto'),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Session_Generator = function ()
{
  log.debug('Session_Generator.construct()');

  this.salt = 'video-paste-sess';
  this.key_salt = 'video-pas' + Math.random() + 'te-sess';

  this.generateSession = function () {
    log.debug('Session_Generator.generateSession()');
    return crypto.createHmac('sha1', this.salt).update(this.key_salt).digest('hex');
  };

  this.createNewSession = function (key, ip, forwardedFor, userId, callback) {
    var
      Session = require(process.env.APP_PATH + "/models/session").Session,
      sess = new Session();

    sess.generateSession(key, ip, forwardedFor, userId);

    Database.saveObject(sess, callback);
  };

};

exports.Session_Generator = Session_Generator;
secure.secureMethods(exports);
