var 
  log = require(process.env.APP_PATH + "/lib/log"), 
  util = require('util'), 
  vimeoApi = require('n-vimeo').video,
  secure = require("node-secure");

var Video_Vimeo_Api = function()
{
  
};

Video_Vimeo_Api.video = function(id, cb)
{
  log.debug('Video_Vimeo_Api.video(' + id + ')');
  
  vimeoApi(id, cb);
};

exports.Video_Vimeo_Api = Video_Vimeo_Api;
secure.secureMethods(exports);
