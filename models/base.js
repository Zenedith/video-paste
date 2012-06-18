var
  Database = require(process.env.APP_PATH + "/lib/database").Database;
  secure = require("node-secure");

var Base = function ()
{
  this.__className = "Base";
  this.__id = 0;
};


Base.prototype.getClassName = function () {
  return this.__className;
};

// get string id value
Base.prototype.getId = function () {
  return this.__id;
};

Base.prototype.setId = function (id) {
  this.__id = id;
};

Base.prototype.load = function (id, callback) {
  this.setId(id);

  Database.loadObject(this, callback);
};

Base.prototype.loadMany = function (ids, callback) {
  Database.loadManyObjects(this, ids, callback);
};

Base.prototype.getObjectValueFromDB = function (id, field, callback) {
  this.setId(id);
  Database.getObjectValue(this, field, callback);
};

Base.prototype.getManyObjectValuesFromDB = function (ids, field, callback) {
  Database.getManyObjectValues(this, ids, field, callback);
};


Base.prototype.setObjectValueToDB = function (id, field, value, callback) {
  this.setId(id);
  this[field] = value;

  Database.setObjectValue(this, field, value, callback);
};

//used for searching elem id base on uniq key
Base.prototype.getUniqeKeys = function () {
  return [];
};

exports.Base = Base;
secure.secureMethods(exports);
