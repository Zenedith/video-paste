var
  secure = require("node-secure");

var Base = function ()
{
  this.__className = "Base";
  this.__id = 0;
};


Base.prototype.getClassName = function () {
  return this.__className;
};

Base.prototype.getId = function () {
  return this.__id;
};

Base.prototype.setId = function (id) {
  this.__id = id;
};

Base.prototype.load = function (id, callback) {
  this.setId(id);

  var
    Database = require(process.env.APP_PATH + "/lib/database").Database;

  Database.load(this, callback);
};

Base.prototype.loadMany = function (ids, callback) {
  var
    Database = require(process.env.APP_PATH + "/lib/database").Database;

  Database.loadMany(this, ids, callback);
};

Base.prototype.getDBValue = function (id, field, callback) {
  this.setId(id);

  var
    Database = require(process.env.APP_PATH + "/lib/database").Database;

  Database.getValue(this, field, callback);
};

Base.prototype.getManyValues = function (ids, field, callback) {
  var
    Database = require(process.env.APP_PATH + "/lib/database").Database;

  Database.getManyValues(this, ids, field, callback);
};


Base.prototype.setDBValue = function (id, field, value, callback) {
  this.setId(id);
  this[field] = value;

  var
    Database = require(process.env.APP_PATH + "/lib/database").Database;

  Database.setValue(this, field, value, callback);
};

//used for searching elem id base on uniq key
Base.prototype.getUniqeKeys = function () {
  return [];
};

exports.Base = Base;
secure.secureMethods(exports);
