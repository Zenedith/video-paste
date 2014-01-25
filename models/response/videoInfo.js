//var
//  log = require(process.env.APP_PATH + "/lib/log");

var videoInfo = function (videoInfoObj) {
//  log.debug('videoInfo.construct()');
    this.url = videoInfoObj.getUrl();
    this.title = videoInfoObj.getTitle();
    this.description = videoInfoObj.getDescription();
    this.thumbUrl = videoInfoObj.getThumbUrl();
    this.explicit = videoInfoObj.getExplicit();
};

exports.videoInfo = videoInfo;
