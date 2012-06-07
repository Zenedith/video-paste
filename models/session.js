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

  this.generateSession = function (key, ip, forwardedFor) {
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
  };
};

//extending base class
//util.inherits(Session, Base);
Session.prototype.__proto__ = Base.prototype;


exports.Session = Session;
secure.secureMethods(exports);
