var
  log = require(process.env.APP_PATH + "/lib/log"),
  util = require('util'),
  Video_Vimeo_Api = require(process.env.APP_PATH + "/models/video/vimeo/api").Video_Vimeo_Api,
  Video = require(process.env.APP_PATH + "/models/video").Video,
  secure = require("node-secure");

var Video_Vimeo = function (url, callback)
{
  log.debug('Video_Vimeo.construct(%s)', url);

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

    var
      _this = this;
    
    Video_Vimeo_Api.video(this.__videoId, function(err, data) {
      if (err || !data) {
        return callback(err, null);  
      }
      
      _this.create(data.raw);

      return callback(null, _this);
    });
  }
  else {
    return callback(null, '');
  }
};


Video_Vimeo.prototype.create = function (data) {
  log.debug('Video_Vimeo.create()');
//  this.__url = data.url;
  this.__title = data.title;
  this.__description = data.description;
  this.__thumbUrl = data.thumbnail_medium;
//  this.explicit = false;
};

//extending base class
//util.inherits(Video_Vimeo, Video);
Video_Vimeo.prototype.__proto__ = Video.prototype;


exports.Video_Vimeo = Video_Vimeo;
secure.secureMethods(exports);
