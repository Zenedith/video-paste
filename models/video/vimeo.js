var
  log = require(process.env.APP_PATH + "/lib/log"),
  util = require('util'),
  vimeoApi = require('n-vimeo').video,
  Video = require(process.env.APP_PATH + "/models/video").Video,
  secure = require("node-secure");

var Video_Vimeo = function (url)
{
  log.debug('Video_Vimeo.construct()');

  Video.call(this); //call parent constructor

  var
    matches = [];


 
  //make "classic site" link
  if (matches = url.match(/http\:\/\/vimeo\.com\/m\/(.+)\/?/i)) {
    url = util.format('http://vimeo.com/%s', matches[1]); 
  }
  
  //get video id
  if (matches = url.match(/http\:\/\/vimeo\.com\/(.+)\/?/i)) {
    this.__url = url;
    this.__videoId = matches[1];
  }

  this.getThumbUrl = function (callback) {
    
    if (this.__videoId) {      
      vimeoApi(this.__videoId, function(err, data) {

        if (err) {
          return callback(err, null);
        }

        return callback(null, data.thumb.m);  //medium
      });
    }
    else {
      return callback(null, '');  
    }
  };

};

//extending base class
//util.inherits(Video_Vimeo, Video);
Video_Vimeo.prototype.__proto__ = Video.prototype;


exports.Video_Vimeo = Video_Vimeo;
secure.secureMethods(exports);
