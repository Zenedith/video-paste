var 
  log = require(process.env.APP_PATH + "/lib/log"), 
  util = require('util'), 
  vimeoApi = require('n-vimeo').video,
  Video_Info = require(process.env.APP_PATH + "/models/video/info").Video_Info,
  secure = require("node-secure");

var Video_Vimeo_Api = function()
{
  
};

Video_Vimeo_Api.video = function(id, cb)
{
  log.debug('Video_Vimeo_Api.video(' + id + ')');
  
  vimeoApi(id, function(err, data) {
    if (err) {
      return cb(err, null);
    }
    
    try {
      var
        videoInfo = new Video_Info();
    
      videoInfo.loadByVimeo(JSON.parse(body));

      return cb(null, videoInfo);
    }
    catch (e) {
      log.critical(e);
      return cb(new Error('Video_Dailymotion_Api.video: internal problem'));
    }
    
  });
};

exports.Video_Vimeo_Api = Video_Vimeo_Api;
secure.secureMethods(exports);
