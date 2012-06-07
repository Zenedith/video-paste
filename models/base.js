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

exports.Base = Base;
secure.secureMethods(exports);
