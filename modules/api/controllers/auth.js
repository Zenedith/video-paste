var
    Key = require(process.env.APP_PATH + "/models/key").Key,
    key_obj = new Key(),
    log = require(process.env.APP_PATH + "/lib/log"),
    config = require('config'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    disableServiceAuth = true, //problem with access key renew in some services
    sanitize = require('sanitizer'),
    secure = require("node-secure");

var Auth_Controller = {
    authFb: function (req, res, next) {
        var
            apiKey = getStringParam(req.query, 'apiKey');

        //validate key
        key_obj.isValidKey(apiKey, function (err) {

            //if something wrong
            if (err) {
                return next(err);
            }

            if (!req.body) {
                return next(error(400, 'Bad request (no POST data)'));
            }

            var
                postData = (req.body) ? req.body.data : '{}',
                input = JSON.parse(postData);

            for (var k in input) {
                if (input.hasOwnProperty(k)) {
                    input[k] = sanitize.escape(input[k]);

                    if (!input[k]) {
                        return next(error(400, 'Bad request (bad ' + k + ' value)'));
                    }
                }
            }

            var
                fbId = input.id,
                name = input.name,
                fist_name = input.fist_name,
                last_name = input.last_name,
                locale = input.locale,
                User = require(process.env.APP_PATH + "/models/user").User,
                accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
                user = new User(),
                User_Validate_Facebook = require(process.env.APP_PATH + "/models/user/validate/facebook").User_Validate_Facebook,
                userValidateFacebook = new User_Validate_Facebook();

            userValidateFacebook.isValid(fbId, name, fist_name, last_name, function (errFb, data) {

                if (!disableServiceAuth && errFb) {
                    return next(errFb);
                }

                user.getIdByExternalId(fbId, accountType.FACEBOOK, function (err2, id) {

                    if (err2) {
                        return next(err2);
                    }

                    //if user not finded, create new
                    if (!id) {
                        user.createNewAccount(accountType.FACEBOOK, fbId, name, fist_name, last_name, locale, function (err3, obj) {
                            if (!err3) {
                                req.userId = obj.getId(); //add info about user and forward to get session method
                                return Auth_Controller.authGuest(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Auth_Controller.authGuest(req, res, next);
                    }
                });
            });
        });
    },
    authGoogle: function (req, res, next) {
        var
            apiKey = getStringParam(req.query, 'apiKey');

        //validate key
        key_obj.isValidKey(apiKey, function (err) {

            //if something wrong
            if (err) {
                return next(err);
            }

            if (!req.body) {
                return next(error(400, 'Bad request (no POST data)'));
            }

            var
                postData = (req.body) ? req.body.data : '{}',
                input = JSON.parse(postData);

            for (var k in input) {
                if (input.hasOwnProperty(k)) {
                    input[k] = sanitize.escape(input[k]);

                    if (!input[k]) {
                        return next(error(400, 'Bad request (bad ' + k + ' value)'));
                    }
                }
            }

            var
                gId = input.id,
                name = input.name,
                fist_name = input.given_name,
                last_name = input.family_name,
                locale = '',
                User = require(process.env.APP_PATH + "/models/user").User,
                accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
                user = new User(),
                User_Validate_Google = require(process.env.APP_PATH + "/models/user/validate/google").User_Validate_Google,
                userValidateGoogle = new User_Validate_Google();

            userValidateGoogle.isValid(gId, name, fist_name, last_name, function (errG, data) {

                if (!disableServiceAuth && errG) {
                    return next(errG);
                }

                user.getIdByExternalId(gId, accountType.GOOGLE, function (err2, id) {

                    if (err2) {
                        return next(err2);
                    }

                    //if user not finded, create new
                    if (!id) {
                        user.createNewAccount(accountType.GOOGLE, gId, name, fist_name, last_name, locale, function (err3, obj) {
                            if (!err3) {
                                req.userId = obj.getId(); //add info about user and forward to get session method
                                return Auth_Controller.authGuest(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Auth_Controller.authGuest(req, res, next);
                    }
                });
            });
        });
    },
    authTwitter: function (req, res, next) {
        var
            apiKey = getStringParam(req.query, 'apiKey');

        //validate key
        key_obj.isValidKey(apiKey, function (err) {

            //if something wrong
            if (err) {
                return next(err);
            }

            if (!req.body) {
                return next(error(400, 'Bad request (no POST data)'));
            }

            var
                postData = (req.body) ? req.body.data : '{}',
                input = JSON.parse(postData);

            for (var k in input) {
                if (input.hasOwnProperty(k)) {
                    input[k] = sanitize.escape(input[k]);

                    if (!input[k]) {
                        return next(error(400, 'Bad request (bad ' + k + ' value)'));
                    }
                }
            }

            var
                tId = input.id,
                name = input.name,
                fist_name = '',
                last_name = '',
                locale = '',
                User = require(process.env.APP_PATH + "/models/user").User,
                accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
                user = new User();

            var
                User_Validate_Twitter = require(process.env.APP_PATH + "/models/user/validate/twitter").User_Validate_Twitter,
                userValidateTwitter = new User_Validate_Twitter();

            userValidateTwitter.isValid(tId, name, function (errT, data) {

                if (!disableServiceAuth && errT) {
                    return next(errT);
                }

                user.getIdByExternalId(tId, accountType.TWITTER, function (err2, id) {

                    if (err2) {
                        return next(err2);
                    }

                    //if user not finded, create new
                    if (!id) {
                        user.createNewAccount(accountType.TWITTER, tId, name, fist_name, last_name, locale, function (err3, obj) {
                            if (!err3) {
                                req.userId = obj.getId(); //add info about user and forward to get session method
                                return Auth_Controller.authGuest(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Auth_Controller.authGuest(req, res, next);
                    }
                });
            });
        });
    },
    authLive: function (req, res, next) {
        var
            apiKey = getStringParam(req.query, 'apiKey');

        //validate key
        key_obj.isValidKey(apiKey, function (err) {

            //if something wrong
            if (err) {
                return next(err);
            }

            if (!req.body) {
                return next(error(400, 'Bad request (no POST data)'));
            }

            var
                postData = (req.body) ? req.body.data : '{}',
                input = JSON.parse(postData);

            for (var k in input) {
                if (input.hasOwnProperty(k)) {
                    input[k] = sanitize.escape(input[k]);

//live has strict policy so dont validate empty values
//        if (!input[k]) {
//          return next(error(400, 'Bad request (bad ' + k + ' value)'));
//        }
                }
            }

            var
                mId = input.id,
                name = input.name || null,
                fist_name = input.fist_name || null,
                last_name = input.last_name || null,
                locale = input.locale || '',
                User = require(process.env.APP_PATH + "/models/user").User,
                accountType = require(process.env.APP_PATH + "/models/user/accountType").accountType,
                user = new User(),
                User_Validate_Live = require(process.env.APP_PATH + "/models/user/validate/live").User_Validate_Live,
                userValidateLive = new User_Validate_Live();

            userValidateLive.isValid(mId, name, fist_name, last_name, function (errLive, data) {

                if (!disableServiceAuth && errLive) {
                    return next(errLive);
                }

                user.getIdByExternalId(mId, accountType.WINDOWS_LIVE, function (err2, id) {

                    if (err2) {
                        return next(err2);
                    }

                    //if user not finded, create new
                    if (!id) {
                        user.createNewAccount(accountType.WINDOWS_LIVE, mId, name, fist_name, last_name, locale, function (err3, obj) {
                            if (!err3) {
                                req.userId = obj.getId(); //add info about user and forward to get session method
                                return Auth_Controller.authGuest(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Auth_Controller.authGuest(req, res, next);
                    }
                });
            });
        });
    },

    authGuest: function (req, res, next) {
        var
            apiKey = getStringParam(req.query, 'apiKey');

        //validate key
        key_obj.isValidKey(apiKey, function (err) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                ip = req.headers['x-real-ip'] || res.connection.remoteAddress,
                forwardedFor = req.headers['x-forwarded-for'] || '',
                Session_Generator = require(process.env.APP_PATH + "/models/session/generator").Session_Generator,
                getSession = require(process.env.APP_PATH + "/models/response/getSession").getSession,
                sess = new Session_Generator();

            sess.createNewSession(apiKey, ip, forwardedFor, req.userId, function (err, obj) {
                if (!err) {
                    var data = new getSession(obj);
                    res.json(data);
                    RequestLogger.log(req, data);
                }
                else {
                    return next(err);
                }
            });
        });
    }
};

//private
var getStringParam = function (params, paramName) {
    var
        param = params[paramName] || "";

    return sanitize.escape(param);
};

module.exports = Auth_Controller;
secure.secureMethods(module.exports);
