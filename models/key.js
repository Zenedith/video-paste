var
  Base = require(process.env.APP_PATH + "/models/base").Base,
  log = require(process.env.APP_PATH + "/lib/log"),
//  util = require("util"),
  secure = require("node-secure");

var Key = function ()
{
  log.debug('Key.construct()');

  const KEY_LIFETIME = 31104000;
  const KEY_VERSION = 1;

  this.__className = "Key";
  this.__lifetime = 0;
  this.__version = 0;
  this.__last_used = 0;

  this.generateKey = function () {
    log.debug('Key.generateKey()');
    var
      Key_Generator = require(process.env.APP_PATH + "/models/key/generator").Key_Generator,
      kgen = new Key_Generator(),
      current_timestamp = Math.round(+new Date()/1000);

    this.setId(kgen.generateKey()); //id is a key!
    this.__lifetime = current_timestamp + KEY_LIFETIME;
    this.__version = KEY_VERSION;
    this.__last_used = current_timestamp;
  };
};

//extending base class
//util.inherits(Key, Base);
Key.prototype.__proto__ = Base.prototype;


exports.Key = Key;
secure.secureMethods(exports);
