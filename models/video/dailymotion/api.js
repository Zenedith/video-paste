var log = require(process.env.APP_PATH + "/lib/log"), util = require('util'), request = require('request'), apiEndpoint = "https://api.dailymotion.com", secure = require("node-secure");

var Video_Dailymotion_Api = function()
{

};

Video_Dailymotion_Api.video = function(id, cb)
{
  log.debug('Video_Dailymotion_Api.video(' + id + ')');

  var url = apiEndpoint + '/video/' + id + '?fields=title,thumbnail_medium_url';  //TODO

  request.get({url : url}, function(err, response, body) {
    if (err) {
      return cb(err, null);
    }

    if (response.statusCode === 200 && body.length > 0) {
      try {
        var raw = JSON.parse(body), data = {
          title : raw.title,
          thumb : raw.thumbnail_medium_url
        };

        return cb(null, data);
      }
      catch (e) {
        cb(new Error('parsing error'));
      }
    }
    else if (!err) {
      cb(new Error('Video_Dailymotion_Api.video: no data'));
    }
  });
};

exports.Video_Dailymotion_Api = Video_Dailymotion_Api;
secure.secureMethods(exports);
