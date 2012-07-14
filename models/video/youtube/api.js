var 
  log = require(process.env.APP_PATH + "/lib/log"), 
  util = require('util'), 
  request = require('request'), 
  apiEndpoint = "https://gdata.youtube.com/",
  secure = require("node-secure");

var Video_Youtube_Api = function()
{

};

Video_Youtube_Api.video = function(id, cb)
{
  log.debug('Video_Youtube_Api.video(' + id + ')');

  //https://developers.google.com/youtube/2.0/developers_guide_jsonc
  var 
    url = util.format('%s/feeds/api/videos/%s?v=2&alt=jsonc', apiEndpoint, id);
  
  request.get({url : url}, function(err, response, body) {
    if (err) {
      return cb(err, null);
    }

    if (response.statusCode === 200 && body.length > 0) {
      try {
       
        var
          data = JSON.parse(body);
        
        return cb(null, data.data);
      }
      catch (e) {
        log.critical(e);
        return cb(new Error('Video_Youtube_Api.video: internal problem'));
      }
    }
    else if (!err) {
      cb(new Error('Video_Youtube_Api.video: no data'));
    }
  });
};

exports.Video_Youtube_Api = Video_Youtube_Api;
secure.secureMethods(exports);
