var
    Base = require(process.env.APP_PATH + "/models/base").Base,
    Database = require(process.env.APP_PATH + "/lib/database").Database,
    log = require(process.env.APP_PATH + "/lib/log"),
    sanitize = require('sanitizer'),
    validator = require('validator'),
    secure = require("node-secure");

var Video = function () {
    this.__className = "Video";

    this.__id = ''; //id is equal postId
    this.__videoId = '';
    this.__url = '';
    this.__title = '';
    this.__description = '';
    this.__thumbUrl = '';
    this.__explicit = false;

    this.saveForPost = function (postId, callback) {
        log.debug('Video.saveForPost(%s)', postId);

        this.setId(postId);
        Database.saveObject(this, callback);
    };

    this.getUrl = function () {
        return this.__url;
    };

    this.getTitle = function () {
        return this.__title;
    };

    this.getDescription = function () {
        return this.__description;
    };

    this.getThumbUrl = function () {
        return this.__thumbUrl;
    };

    this.getExplicit = function () {
        return this.__explicit;
    };
};

//static
Video.factory = function (url, callback) {
    log.debug('Video.factory()');

    url = url || '';
    url = sanitize.escape(url);

    try {
        validator.isURL(url);
    }
    catch (e) {
        return null;
    }

    //base factory check

    if (/youtube\.com\//.test(url)) {
        var
            Video_Youtube = require(process.env.APP_PATH + "/models/video/youtube").Video_Youtube;

        return new Video_Youtube(url, callback);
    }

    if (/vimeo\.com\//.test(url)) {
        var
            Video_Vimeo = require(process.env.APP_PATH + "/models/video/vimeo").Video_Vimeo;

        return new Video_Vimeo(url, callback);
    }

    if (/dailymotion\.com\//.test(url)) {
        var
            Video_Dailymotion = require(process.env.APP_PATH + "/models/video/dailymotion").Video_Dailymotion;

        return new Video_Dailymotion(url, callback);
    }

    return callback(error(400, 'Wrong url'));
};

Video.prototype.__proto__ = Base.prototype;

exports.Video = Video;
secure.secureMethods(exports);
