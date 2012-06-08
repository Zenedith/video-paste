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

//used for searching elem id base on uniq key
Base.prototype.getUniqeKeys = function () {
  return [];
};

exports.Base = Base;
secure.secureMethods(exports);
