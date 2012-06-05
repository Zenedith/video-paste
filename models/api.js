var
  config = require('config'),
  secure = require("node-secure");

var Api = function ()
{
  log.debug('Api.construct()');

};

exports.Api = Api;
secure.secureMethods(exports);
