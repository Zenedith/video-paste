var
  log = require(process.env.APP_PATH + "/lib/log"),
  crypto = require('crypto'),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Key_Generator = function ()
{
  log.debug('Key_Generator.construct()');

  this.salt = 'video-paste-key';
  this.key_salt = 'video-pas' + Math.random() + 'te-key';

  this.generateKey = function () {
    log.debug('Key_Generator.generateKey()');
    var key = crypto.createHmac('sha1', this.salt).update(this.key_salt).digest('hex');

    return key.substr(4,16);
  };

  this.createNewKey = function (callback) {
    Key = require(process.env.APP_PATH + "/models/key").Key;
    var key = new Key();
    key.generateKey();

    Database.saveObject(key, callback);
  };

};

exports.Key_Generator = Key_Generator;
secure.secureMethods(exports);
