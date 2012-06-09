var
  log = require(process.env.APP_PATH + "/lib/log"),
  sanitize = require('validator').sanitize,
  check = require('validator').check,
  util = require('util'),
  secure = require("node-secure");

var Url = function (url)
{
  log.debug('Url.construct()');

  url = url || '';

  this.__url = sanitize(url).xss();
  this.makeValidFormat();


  this.isValid = function () {

    try {
      check(this.__url).notEmpty().isUrl();

      return (
        (/^https?\:\/\/vimeo\.com\//.test(this.__url)) ||
        (/^https?\:\/\/www\.dailymotion\.com\//.test(this.__url))  ||
        (/^https?\:\/\/www\.youtube\.com\//.test(this.__url))
      );
    }
    catch (e) {
    }

    return false;
  };

  this.get = function () {
    return this.__url;
  };

};

Url.prototype.makeValidFormat = function () {

  var
    matches = [];

  if (matches = this.__url.match(/(https?)\:\/\/m\.youtube\.com\/.+?v=(.+)&?/i)) {
    this.__url = util.format('%s://www.youtube.com/watch?v=%s', matches[1], matches[2]);
  }
  else if (matches = this.__url.match(/(https?)\:\/\/touch.dailymotion.com\/(.+)/i)) {
    this.__url = util.format('%s://www.dailymotion.com/%s', matches[1], matches[2]);
  }
};

exports.Url = Url;
secure.secureMethods(exports);
