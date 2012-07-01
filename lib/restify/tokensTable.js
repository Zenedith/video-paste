var
//  config = require('config'),
//  log = require(process.env.APP_PATH + "/lib/log"),
  Restify_TokensTable_Database = require(process.env.APP_PATH + "/lib/restify/tokensTable/database").Restify_TokensTable_Database;
  secure = require("node-secure");


var Restify_TokensTable = function (options) {
  this.backend = Restify_TokensTable_Database;
};


Restify_TokensTable.prototype.put = function put(key, value) {
  if (typeof (key) !== 'string') {
    throw new TypeError('key (String) required');
  }
    
  this.backend.put(key, value);
};


Restify_TokensTable.prototype.get = function get(key) {
  if (typeof (key) !== 'string') {
    throw new TypeError('key (String) required');
  }
  
  return this.backend.get(key);
};

Restify_TokensTable.prototype.updateDatabase = function updateDatabase(callback) {
  this.backend.updateDatabase(callback);
};


exports.Restify_TokensTable = Restify_TokensTable;
secure.secureMethods(exports);
