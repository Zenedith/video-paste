var
    config = require('config'),
    secure = require("node-secure");

var Index_Controller = {
    index: function (req, res) {
        res.render('index/index', {title: 'video-paste api'});
    },
    request_logger: function (req, res) {

        var
            RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger;

        RequestLogger.update();

        res.render('index/request_logger', {title: 'video-paste api - request logger'});
    }
};

module.exports = Index_Controller;
secure.secureMethods(module.exports);
