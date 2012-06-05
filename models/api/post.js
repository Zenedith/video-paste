var
  config = require('config'),
  secure = require("node-secure");

var Api_Post = function ()
{
  log.debug('Api_Post.construct()');

};

exports.Api_Post = Api_Post;
secure.secureMethods(exports);
