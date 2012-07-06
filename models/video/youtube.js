var
  log = require(process.env.APP_PATH + "/lib/log"),
  util = require('util'),
  Video_Youtube_Api = require(process.env.APP_PATH + "/models/video/youtube/api").Video_Youtube_Api,
  Video = require(process.env.APP_PATH + "/models/video").Video,
  secure = require("node-secure");

var Video_Youtube = function (url)
{
  log.debug('Video_Youtube.construct()');

  Video.call(this); //call parent constructor

  var
    matches = [];

  //make "classic site" link
  if (matches = url.match(/(https?)\:\/\/m\.youtube\.com\/.*v=(.+)&?/i)) {
    url = util.format('http://www.youtube.com/watch?v=%s', matches[2]);
  }
  
  if (matches = url.match(/http\:\/\/www\.youtube\.com\/watch\?.*v=(.+)&?/i)) {
    this.__url = url;
    
    //get video id
    if (matches = this.__url.match(/http\:\/\/www\.youtube\.com\/.*v=(.+)&?/i)) {
      this.__videoId = matches[1];
    }
  }

  this.getThumbUrl = function (callback) {
    
    if (this.__videoId) {      
      Video_Youtube_Api.video(this.__videoId, function(err, videoInfo) {
        if (err || !videoInfo) {
          return callback(err, null);  
        }

        return callback(null, videoInfo.getThumbUrl());
      });
    }
    else {
      return callback(null, '');  
    }
  };

};

//extending base class
//util.inherits(Video_Youtube, Video);
Video_Youtube.prototype.__proto__ = Video.prototype;


exports.Video_Youtube = Video_Youtube;
secure.secureMethods(exports);
