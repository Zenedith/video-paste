var
    log = require(process.env.APP_PATH + "/lib/log"),
    util = require('util'),
    Video_Youtube_Api = require(process.env.APP_PATH + "/models/video/youtube/api").Video_Youtube_Api,
    Video = require(process.env.APP_PATH + "/models/video").Video,
    secure = require("node-secure");

var Video_Youtube = function (url, callback) {
    log.debug('Video_Youtube.construct(%s)', url);

    Video.call(this); //call parent constructor

    var
        matches = [];

    //make "classic site" link
    if (matches = url.match(/(https?)\:\/\/m\.youtube\.com\/.*v=(.+)&?/i)) {
        url = util.format('http://www.youtube.com/watch?v=%s', matches[2]);
    }

    if (matches = url.match(/http\:\/\/www\.youtube\.com\/watch\?.*v=(.+)&?/i)) {
        this.__url = url;

        //check video id
        if (matches = this.__url.match(/http\:\/\/www\.youtube\.com\/.*v=(.+)&?/i)) {
            this.__videoId = matches[1];

            var
                _this = this;

            //get data from api
            Video_Youtube_Api.video(this.__videoId, function (err, data) {
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


Video_Youtube.prototype.create = function (data) {
    log.debug('Video_Youtube.create()');
//  this.__url = data.content[1];
    this.__title = data.title;
    this.__description = data.description;
    this.__thumbUrl = data.thumbnail.hqDefault;
//  this.explicit = false;
};


//extending base class
//util.inherits(Video_Youtube, Video);
Video_Youtube.prototype.__proto__ = Video.prototype;


exports.Video_Youtube = Video_Youtube;
secure.secureMethods(exports);
