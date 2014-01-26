var
    Session = require(process.env.APP_PATH + "/models/session").Session,
    sess_obj = new Session(),
    User = require(process.env.APP_PATH + "/models/user").User,
    userObj = new User(),
    log = require(process.env.APP_PATH + "/lib/log"),
    config = require('config'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    sanitize = require('sanitizer'),
    secure = require("node-secure");

var Users_Controller = {
    profile: function (req, res, next) {
        var
            userId = getStringParam(req.params, "userId"),
            sessionId = getStringParam(req.query, "sessionId");

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, sessionObj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            //must be authorized user
            if (sessionObj.getUserId() < 1) {
                return next(error(401, 'Session not authorized (userId)'));
            }

            var
                profile = require(process.env.APP_PATH + "/models/response/profile").profile;

            if (userId == "me") {
                userId = sessionObj.getUserId();
            }

            userObj.load(userId, function (err2, u_obj) {
                if (err2) {
                    return next(err2);
                }

                if (!u_obj) {
                    return next(error(607, 'User not exists (userId)'));
                }

                var
                    data = new profile(u_obj);

                res.json(data);
                RequestLogger.log(req, data);
            });
        });
    }
};

var getStringParam = function (params, paramName) {
    var
        param = params[paramName] || "";

    return sanitize.escape(param);
};

module.exports = Users_Controller;
secure.secureMethods(module.exports);
