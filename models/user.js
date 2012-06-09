var
  Base = require(process.env.APP_PATH + "/models/base").Base,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
//  util = require("util"),
  secure = require("node-secure");

var User = function ()
{
  log.debug('User.construct()');

  this.__className = "User";
  this.__account_type = accountType.FACEBOOK;
  this.__created = 0;
  this.__externalId = 0;
  this.__name = '';
  this.__fist_name = '';
  this.__last_name = '';
  this.__locale = '';

  this.createNewFbUser = function (externalId, name, fist_name, last_name, locale, callback) {
    log.debug('User.createNewUser()');

//    if (!externalId) {
//      return callback(error(601, 'Brak externalId usera'), null);
//    }

    this.__account_type = accountType.FACEBOOK;
    this.__created = Math.round(+new Date()/1000);
    this.__externalId = externalId;
    this.__name = name;
    this.__fist_name = fist_name;
    this.__last_name = last_name;
    this.__locale = locale;

    Database.save(this, callback);
  };

  this.getName = function () {
    return this.__name;
  };

  this.getNameById = function (id, callback) {
    this.getDBValue(id, '__name', callback);
  };

  this.getNamesByIds = function (ids, callback) {
    this.getManyValues(ids, '__name', callback);
  };

  this.getIdByExternalId = function (externalId, account_type, callback) {
//    log.debug('User.getIdByExternalId(' + externalId + ', ' + account_type + ')');
    Database.getIdByUniqeKey(this, [externalId, account_type], callback);
  };

  this.getFirstName = function () {
    return this.__fist_name;
  };

  this.getLastName = function () {
    return this.__last_name;
  };

  this.getLocale = function () {
    return this.__locale;
  };
};

//used for searching elem id base on uniq key
User.prototype.getUniqeKeys = function () {
  return ['__externalId', '__account_type'];
};

//extending base class
//util.inherits(User, Base);
User.prototype.__proto__ = Base.prototype;


exports.User = User;
secure.secureMethods(exports);
