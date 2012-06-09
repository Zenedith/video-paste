var
  Base = require(process.env.APP_PATH + "/models/base").Base,
  log = require(process.env.APP_PATH + "/lib/log"),
//  util = require("util"),
  secure = require("node-secure");

var Session = function ()
{
  log.debug('Session.construct()');

  const SESSION_LIFETIME = 3600;

  this.__className = "Session";
  this.__device = '';
  this.__locale = '';
  this.__lifetime = 0;
  this.__key = '';
  this.__client_ip = '';
  this.__client_forwarder_for = '';
  this.__userId = 0;

  this.generateSession = function (key, ip, forwardedFor, userId) {
    log.debug('Session.generateSession()');
    var
      Session_Generator = require(process.env.APP_PATH + "/models/session/generator").Session_Generator,
      sgen = new Session_Generator(),
      current_timestamp = Math.round(+new Date()/1000);

    this.setId(sgen.generateSession());
    this.__key = key;
    this.__lifetime = current_timestamp + SESSION_LIFETIME;
    this.__client_ip = ip;
    this.__client_forwarder_for = forwardedFor;
    this.__userId = parseInt(userId) || 0;
  };

  this.isValidSession = function (id, callback) {
    var
      _this = this;

    this.load(id, function(err, obj) {
      if (obj === null) {
        return callback(error(603, 'invalid api sessionId'), null);
      }

      var
        current_timestamp = Math.round(+new Date()/1000);

      //check expiration time
      if (obj.getLifeTime() < current_timestamp) {
        return callback(error(603, 'sessionId has expired'), null);
      }

      //TODO check key
      var
        Key = require(process.env.APP_PATH + "/models/key").Key,
        key_obj = new Key(),
        apiKey = _this.getApiKey();

      //validate key
      key_obj.isValidKey(apiKey, function (err, _obj_) {

        //if something wrong
        if (err) {
          return next(err);
        }

        //renew session
        _this.setDBValue(id, '__lifetime', (current_timestamp + SESSION_LIFETIME), function (err, __obj__) {
          return callback(err, obj);  //call calback with full loaded obj, not _obj_ or __obj__
        });
      });
    });
  };
};

Session.prototype.getLifeTime = function() {
  return this.__lifetime;
};

Session.prototype.getUserId = function() {
  return this.__userId;
};

Session.prototype.getApiKey = function() {
  return this.__key;
};

//extending base class
//util.inherits(Session, Base);
Session.prototype.__proto__ = Base.prototype;


exports.Session = Session;
secure.secureMethods(exports);
