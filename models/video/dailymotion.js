var
    log = require(process.env.APP_PATH + "/lib/logger").logger,
    util = require('util'),
    Video_Dailymotion_Api = require(process.env.APP_PATH + "/models/video/dailymotion/api").Video_Dailymotion_Api,
    Video = require(process.env.APP_PATH + "/models/video").Video,
    secure = require("node-secure");

var Video_Dailymotion = function (url, callback) {
    log.debug('Video_Dailymotion.construct(%s)', url);

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

            var
                _this = this;

            Video_Dailymotion_Api.video(this.__videoId, function (err, data) {
                if (err || !data) {
                    return callback(err, null);
                }

                _this.create(data);

                return callback(null, _this);
            });
        }
        else {
            return callback(null, '');
        }
    }
    else {
        return callback(null, '');
    }
};


Video_Dailymotion.prototype.create = function (data) {
    log.debug('Video_Dailymotion.create()');
    this.__videoId = data.id;
//  this.__url = data.url;
    this.__title = data.title;
    this.__description = data.description;
    this.__thumbUrl = data.thumbnail_medium_url;
    this.__explicit = data.explicit;
};

//extending base class
//util.inherits(Video_Dailymotion, Video);
Video_Dailymotion.prototype.__proto__ = Video.prototype;

exports.Video_Dailymotion = Video_Dailymotion;
secure.secureMethods(exports);
