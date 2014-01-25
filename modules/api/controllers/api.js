var
    log = require(process.env.APP_PATH + "/lib/log"),
    config = require('config'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    disableServiceAuth = true,  //problem with access key renew in some services
    sanitize = require('validator').sanitize,
    secure = require("node-secure");

var Api_Controller = {
    generate_key: function (req, res, next) {
        var
            Key_Generator = require(process.env.APP_PATH + "/models/key/generator").Key_Generator,
            generateKey = require(process.env.APP_PATH + "/models/response/generateKey").generateKey,
            key = new Key_Generator();

        key.createNewKey(function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var data = new generateKey(obj);
            res.json(data);
            RequestLogger.log(req, data);
        });
    },
    //api/loginByFb/:apiKey/:id/:name/:fist_name/:last_name/:locale
    login_fb: function (req, res, next) {
        var
            apiKey = req.params.apiKey,
            Key = require(process.env.APP_PATH + "/models/key").Key,
            key_obj = new Key();

        //validate key
        key_obj.isValidKey(apiKey, function (err, obj) {

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
                    input[k] = sanitize(input[k]).xss();

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
                                return Api_Controller.get_session(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Api_Controller.get_session(req, res, next);
                    }
                });
            });
        });
    },
    //api/loginByWindowsLive/:apiKey/:id/:name/:fist_name/:last_name/:locale
    login_winlive: function (req, res, next) {
        var
            apiKey = req.params.apiKey,
            Key = require(process.env.APP_PATH + "/models/key").Key,
            key_obj = new Key();

        //validate key
        key_obj.isValidKey(apiKey, function (err, obj) {

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
                    input[k] = sanitize(input[k]).xss();

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
                                return Api_Controller.get_session(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Api_Controller.get_session(req, res, next);
                    }
                });
            });
        });
    },
    //api/loginByGoogle/:apiKey/:id/:name/:given_name/:family_name
    login_google: function (req, res, next) {
        var
            apiKey = req.params.apiKey,
            Key = require(process.env.APP_PATH + "/models/key").Key,
            key_obj = new Key();

        //validate key
        key_obj.isValidKey(apiKey, function (err, obj) {

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
                    input[k] = sanitize(input[k]).xss();

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
                                return Api_Controller.get_session(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Api_Controller.get_session(req, res, next);
                    }
                });
            });
        });
    },
    //api/loginByTwitter/:apiKey/:id/:name
    login_twitter: function (req, res, next) {
        var
            apiKey = req.params.apiKey,
            Key = require(process.env.APP_PATH + "/models/key").Key,
            key_obj = new Key();

        //validate key
        key_obj.isValidKey(apiKey, function (err, obj) {

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
                    input[k] = sanitize(input[k]).xss();

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
                                return Api_Controller.get_session(req, res, next);
                            }

                            return next(err3);
                        });
                    }
                    else {
                        req.userId = id; //add info about user and forward to get session method

                        //TODO check to update user data with new ones!

                        return Api_Controller.get_session(req, res, next);
                    }
                });
            });
        });
    },
    get_session: function (req, res, next) {
        var
            Key = require(process.env.APP_PATH + "/models/key").Key,
            key_obj = new Key(),
            apiKey = req.params.apiKey;

        //validate key
        key_obj.isValidKey(apiKey, function (err, obj) {

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
    },

    //api/postLink/:sessionId/:postId
    post_get: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                postId = ~~(req.params.postId) || 0;

            if (postId < 1) {
                return next(error(400, 'Bad request (bad postId value)'));
            }

            var
                Post = require(process.env.APP_PATH + "/models/post").Post,
                post = new Post();

            post.load(postId, function (err2, p_obj) {

                if (err2) {
                    return next(err2);
                }

                var
                    decorator_PostLink = require(process.env.APP_PATH + "/models/decorator/postLink").decorator_PostLink;

                decorator_PostLink([p_obj], function (err3, decoratedPosts) {

                    if (err3) {
                        return next(err3);
                    }

                    var
                        data = decoratedPosts[0];

                    res.json(data);
                    RequestLogger.log(req, data);
                });
            });
        });
    },
    //api/postViews/:sessionId/:postId
    postViews: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                postId = ~~(req.params.postId) || 0;
//        userId = obj.getUserId();
//
//      if (userId < 1) {
//        return next(error(401, 'Session not authorized (userId)'));
//      }


            if (postId < 1) {
                return next(error(400, 'Bad request (bad postId value)'));
            }

            var
                Post_Views = require(process.env.APP_PATH + "/models/post/views").Post_Views,
                postViews = require(process.env.APP_PATH + "/models/response/postViews").postViews,
                postViewsObj = new Post_Views(postId);

            postViewsObj.views(function (err2, viewsValue) {
                if (err2) {
                    return next(err2);
                }

                var data = new postViews(postId, viewsValue);

                res.json(data);
                RequestLogger.log(req, data);
            });
        });
    },

    //api/postRate/:sessionId/:postId
    //rate from post body
    postRate: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            if (!req.body) {
                return next(error(400, 'Bad request (no POST data)'));
            }

            var
                postId = ~~(req.params.postId) || 0,
                postData = (req.body) ? req.body.data : '{}',
                input = JSON.parse(postData),
                rate = ~~(input.rate) || 0,
                userId = obj.getUserId();

            if (userId < 1) {
                return next(error(401, 'Session not authorized (userId)'));
            }

            if (postId < 1) {
                return next(error(400, 'Bad Request (postId)'));
            }

            if (rate === 0) {
                return next(error(400, 'Bad Request (rate)'));
            }

            //check accepted value
            if (rate > 1) {
                rate = 1;
            }

            if (rate < -1) {
                rate = -1;
            }

            var
                Post_Rate = require(process.env.APP_PATH + "/models/post/rate").Post_Rate,
                postRate = require(process.env.APP_PATH + "/models/response/postRate").postRate,
                postRateObj = new Post_Rate(postId);

            postRateObj.rate(rate, userId, function (err2, rateValue) {
                if (err2) {
                    return next(err2);
                }

                var data = new postRate(postId, rateValue);

                res.json(data);
                RequestLogger.log(req, data);
            });
        });
    },

    // create postLink
    post_create: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                userId = obj.getUserId();

            if (userId < 1) {
                return next(error(401, 'Session not authorized (userId)'));
            }

            if (!req.body) {
                return next(error(400, 'Bad request (no POST data)'));
            }

            var
                postData = (req.body) ? req.body.data : '{}',
                input = JSON.parse(postData),
                url = input.url || '',
                Video = require(process.env.APP_PATH + "/models/video").Video;

            if (!url) {
                return next(error(400, 'Bad Request (url)'));
            }

            Video.factory(url, function (err2, videoObj) {

                if (err2) {
                    return next(err2);
                }

                if (!videoObj.getUrl()) {
                    return next(error(400, 'Bad request (url param)'));
                }

                var
                    tags = input.tags || [],
                    Post = require(process.env.APP_PATH + "/models/post").Post,
                    post = new Post();

                try {
                    post.createNewPost(videoObj, tags, userId, function (err3, p_obj) {

                        if (err3) {
                            return next(err3);
                        }


                        //TODO dont use decorator
                        var
                            decorator_PostLink = require(process.env.APP_PATH + "/models/decorator/postLink").decorator_PostLink;

                        decorator_PostLink([p_obj], function (err4, decoratedPosts) {

                            if (err4) {
                                return next(err4);
                            }

                            var
                                data = decoratedPosts[0];

                            res.json(data, 201);
                            RequestLogger.log(req, data);
                        });
                    });
                }
                catch (e) {
                    return next(e);
                }
            });
        });
    },
    //get top link:  /api/getTopLinks/:sessionId/:categoryId/:limit/:page
    get_top_link: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                limit = ~~(req.params.limit) || 1,
                page = ~~(req.params.page) || 1,
                getTopLinks = require(process.env.APP_PATH + "/models/response/getTopLinks").getTopLinks,
                Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
                postRateList = new Post_List();

            if (limit > 100) {
                return next(error(400, 'Bad request (too big limit value)'));
            }

            postRateList.getByRate(limit, page, function (err2, listObj) {

                if (err2) {
                    return next(err2);
                }

                new getTopLinks(listObj, function (err3, data) {
                    if (err3) {
                        return next(err3);
                    }

                    res.json(data);
                    RequestLogger.log(req, data);
                });

            });

        });
    },
    //get new links:  /api/getNewLinks/:sessionId/:limit/:page
    get_new_links: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                limit = ~~(req.params.limit) || 1,
                page = ~~(req.params.page) || 1,
                getNewLinks = require(process.env.APP_PATH + "/models/response/getNewLinks").getNewLinks,
                Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
                postListNew = new Post_List();

            if (limit > 100) {
                return next(error(400, 'Bad request (too big limit value)'));
            }

            postListNew.getNew(limit, page, function (err2, listObj) {

                if (err2) {
                    return next(err2);
                }

                new getNewLinks(listObj, function (err3, data) {

                    if (err3) {
                        return next(err3);
                    }

                    res.json(data);
                    RequestLogger.log(req, data);
                });

            });

        });
    },
    //api/getTags/:apiKey
    getTags: function (req, res, next) {
        var
            apiKey = req.params.apiKey,
            Key = require(process.env.APP_PATH + "/models/key").Key,
            key_obj = new Key();

        //validate key
        key_obj.isValidKey(apiKey, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                searchKey = req.params.searchKey || '',
                limit = ~~(req.params.limit) || 1,
                page = ~~(req.params.page) || 1,
                getTags = require(process.env.APP_PATH + "/models/response/getTags").getTags,
                Tag = require(process.env.APP_PATH + "/models/tag").Tag,
                tag = new Tag(searchKey);

            if (limit > 100) {
                return next(error(400, 'Bad request (too big limit value)'));
            }

            //searchKey is optional
            if (searchKey) {
                searchKey = sanitize(searchKey).xss();

                if (!searchKey) {
                    return next(error(400, 'Bad request (bad searchKey value)'));
                }
            }

            tag.getTags(searchKey, limit, page, function (err2, listObj) {

                if (err2) {
                    return next(err2);
                }

                var data = new getTags(listObj);
                res.json(data);
                RequestLogger.log(req, data);
            });
        });
    },
    //api/getLinksByTag/:sessionId/:tagName/:limit/:page
    getLinksByTag: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                tagName = req.params.tagName || '',
                limit = ~~(req.params.limit) || 1,
                page = ~~(req.params.page) || 1,
                getLinksByTag = require(process.env.APP_PATH + "/models/response/getLinksByTag").getLinksByTag,
                Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
                postList = new Post_List();

            if (limit > 100) {
                return next(error(400, 'Bad request (too big limit value)'));
            }

            tagName = sanitize(tagName).xss();

            if (!tagName) {
                return next(error(400, 'Bad request (bad tagName value)'));
            }

            postList.getByTag(tagName, limit, page, function (err2, listObj) {

                if (err2) {
                    return next(err2);
                }

                new getLinksByTag(listObj, function (err3, data) {
                    if (err3) {
                        return next(err3);
                    }

                    res.json(data);
                    RequestLogger.log(req, data);
                });
            });
        });
    },
    //api/profile/:sessionId/:userId
    profile: function (req, res, next) {
        var
            Session = require(process.env.APP_PATH + "/models/session").Session,
            sess_obj = new Session(),
            sessionId = req.params.sessionId;

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            //must be authorized user
            if (obj.getUserId() < 1) {
                return next(error(401, 'Session not authorized (userId)'));
            }

            var
                profile = require(process.env.APP_PATH + "/models/response/profile").profile,
                User = require(process.env.APP_PATH + "/models/user").User,
                userId = req.params.userId || obj.getUserId(), //get given user id profile or my profile
                userObj = new User();

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

module.exports = Api_Controller;
secure.secureMethods(module.exports);
