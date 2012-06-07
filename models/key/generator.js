var
  log = require(process.env.APP_PATH + "/lib/log"),
  crypto = require('crypto'),
  secure = require("node-secure");

var Key_Generator = function ()
{
  log.debug('Key_Generator.construct()');

  this.salt = 'video-paste-crypto';
  this.key_salt = 'video-pas' + Math.random() + 'te-crypto';

  this.generateKey = function () {
    log.debug('Key_Generator.generateKey()');
    var key = crypto.createHmac('sha1', this.salt).update(this.key_salt).digest('hex');

    return key;
  };
};

exports.Key_Generator = Key_Generator;
secure.secureMethods(exports);
