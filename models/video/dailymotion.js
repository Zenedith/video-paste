var
  log = require(process.env.APP_PATH + "/lib/log"),
  util = require('util'),
  Video_Dailymotion_Api = require(process.env.APP_PATH + "/models/video/dailymotion/api").Video_Dailymotion_Api,
  Video = require(process.env.APP_PATH + "/models/video").Video,
  secure = require("node-secure");

var Video_Dailymotion = function (url)
{
  log.debug('Video_Dailymotion.construct()');

  Video.call(this); //call parent constructor

  var
    matches = [];
  
  //make "classic site" link
  if (matches = url.match(/(https?)\:\/\/touch.dailymotion.com\/video\/(.+)/i)) {
    url = util.format('http://www.dailymotion.com/video/%s', matches[2]);
  }

  if (matches = url.match(/http\:\/\/www.dailymotion.com\/video\/(.+)/i)) {
    this.__url = url;
    
    //get video id
    if (matches = this.__url.match(/http\:\/\/www\.dailymotion\.com\/video\/(.+)\/?/i)) {
      this.__videoId = matches[1];
    }
  }

  this.getThumbUrl = function (callback) {

    if (this.__videoId) {
      Video_Dailymotion_Api.video(this.__videoId, function (err, videoInfo) {
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
//util.inherits(Video_Dailymotion, Video);
Video_Dailymotion.prototype.__proto__ = Video.prototype;

exports.Video_Dailymotion = Video_Dailymotion;
secure.secureMethods(exports);
