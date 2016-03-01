var
    log = require(process.env.APP_PATH + "/lib/logger").logger,
    config = require('config'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    disableServiceAuth = true, //problem with access key renew in some services
    sanitize = require('sanitizer'),
    secure = require("node-secure");

var Keys_Controller = {
    create: function (req, res, next) {
        var
            Key_Generator = require(process.env.APP_PATH + "/models/key/generator").Key_Generator,
            generateKey = require(process.env.APP_PATH + "/models/response/generateKey").generateKey,
            key = new Key_Generator();

//    if (!getStringParam(req.query, 'generateKey')) {
//      RequestLogger.log(req, {});
//      return next(error(400, 'Bad request'));
//    }

        key.createNewKey(function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var data = new generateKey(obj);
            res.json(data);
            RequestLogger.log(req, data);
        });
    }
};

//private
var getStringParam = function (params, paramName) {
    var
        param = params[paramName] || "";

    return sanitize.escape(param);
};

module.exports = Keys_Controller;
secure.secureMethods(module.exports);