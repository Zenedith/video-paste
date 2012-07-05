var
  log = require(process.env.APP_PATH + "/lib/log"),
  util = require('util'),
  Video = require(process.env.APP_PATH + "/models/video").Video,
  secure = require("node-secure");

var Video_Youtube = function (url)
{
  log.debug('Video_Youtube.construct()');

  Video.call(this); //call parent constructor

  var
    matches = [];

  console.log(url);
  
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
  else {
    console.log('invalid: ' + url);
  }

  this.getThumbUrl = function (callback) {
    if (this.__videoId) {
      return callback(null, util.format('http://img.youtube.com/vi/%s/hqdefault.jpg', this.__videoId));
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
