var
  log = require(process.env.APP_PATH + "/lib/log"),
  sanitize = require('validator').sanitize,
  check = require('validator').check,
  secure = require("node-secure");

var Video = function (url) {
  this.__url = url;
  this.__videoId = '';

  this.getUrl = function () {
    return this.__url;
  };

};

//static
Video.factory = function (url)
{
  log.debug('Video.factory()');

  url = url || '';
  url = sanitize(url).xss();

  try {
    check(url).notEmpty().isUrl();
  }
  catch (e) {
    return null;
  }
  
  //base factory check
  
  if (/youtube\.com\//.test(url)) {
    var
      Video_Youtube = require(process.env.APP_PATH + "/models/video/youtube").Video_Youtube;
    
    return new Video_Youtube(url);
  }

  if (/vimeo\.com\//.test(url)) {
    var
      Video_Vimeo = require(process.env.APP_PATH + "/models/video/vimeo").Video_Vimeo;
    
    return new Video_Vimeo(url);
  }
  
  if (/dailymotion\.com\//.test(url)) {
    var
      Video_Dailymotion = require(process.env.APP_PATH + "/models/video/dailymotion").Video_Dailymotion;
    
    return new Video_Dailymotion(url);
  }

};

exports.Video = Video;
secure.secureMethods(exports);
