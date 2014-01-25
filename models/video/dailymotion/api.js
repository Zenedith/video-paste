var
    log = require(process.env.APP_PATH + "/lib/log"),
    util = require('util'),
    request = require('request'),
    apiEndpoint = "https://api.dailymotion.com",
    secure = require("node-secure");

var Video_Dailymotion_Api = function () {

};

Video_Dailymotion_Api.video = function (id, cb) {
    log.debug('Video_Dailymotion_Api.video(' + id + ')');

    //https://www.dailymotion.com/doc/api/obj-video.html
    var
        url = util.format('%s/video/%s?fields=id,title,description,url,thumbnail_medium_url,explicit', apiEndpoint, id);

    request.get({url: url}, function (err, response, body) {
        if (err) {
            return cb(err, null);
        }

        if (response.statusCode === 200 && body.length > 0) {

            var
                data = JSON.parse(body);

            return cb(null, data);
        }
        else if (!err) {
            cb(new Error('Video_Dailymotion_Api.video: no data'));
        }
    });
};

exports.Video_Dailymotion_Api = Video_Dailymotion_Api;
secure.secureMethods(exports);
