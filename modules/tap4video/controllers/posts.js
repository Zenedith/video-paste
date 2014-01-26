var
    Session = require(process.env.APP_PATH + "/models/session").Session,
    sess_obj = new Session(),
    log = require(process.env.APP_PATH + "/lib/log"),
    config = require('config'),
    RequestLogger = require(process.env.APP_PATH + "/lib/requestLogger").RequestLogger,
    sanitize = require('sanitizer'),
    secure = require("node-secure");

var Posts_Controller = {
    create: function (req, res, next) {

        if (isEmptyJson(req.body)) {
            return next(error(400, 'Bad request (no POST data)'));
        }

        var
            jsonBody = getJsonBodyData(req),
            sessionId = getStringParam(req.query, "sessionId");

        log.debug(jsonBody);

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, sessionObj) {

            //if something wrong
            if (err) {
                log.debug(err);
                return next(err);
            }

            var
                userId = sessionObj.getUserId();

            if (userId < 1) {
                return next(error(401, 'Session not authorized (userId)'));
            }

            var
                url = jsonBody.url || '',
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
                    tags = jsonBody.tags || [],
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

                            res.location('/posts/' + data.postId);
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
    get: function (req, res, next) {
        var
            postId = getIntegerParam(req.params, "postId"),
            sessionId = getStringParam(req.query, "sessionId");

        log.debug(postId);
        log.debug(sessionId);

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

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
    postViews: function (req, res, next) {
        var
            postId = getIntegerParam(req.params, "postId"),
            sessionId = getStringParam(req.query, "sessionId");

        if (postId < 1) {
            return next(error(400, 'Bad request (bad postId value)'));
        }

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
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

    postRate: function (req, res, next) {
        if (isEmptyJson(req.body)) {
            return next(error(400, 'Bad request (no POST data)'));
        }

        var
            jsonBody = getJsonBodyData(req),
            postId = getIntegerParam(req.params, "postId"),
            rate = getIntegerParam(jsonBody, "rate"),
            sessionId = getStringParam(req.query, "sessionId");

        if (postId < 1) {
            return next(error(400, 'Bad Request (postId)'));
        }

        if (rate === 0) {
            return next(error(400, 'Bad Request (rate)'));
        }

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, sessionObj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            var
                userId = sessionObj.getUserId();

            if (userId < 1) {
                return next(error(401, 'Session not authorized (userId)'));
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

    search: function (req, res, next) {
        var
            tagName = getStringParam(req.query, "tagName"),
            newest = getStringParam(req.query, "new"),
            limit = getIntegerParam(req.query, "limit", 1),
            page = getIntegerParam(req.query, "page", 1),
            sessionId = getStringParam(req.query, "sessionId");

        if (limit > 100) {
            return next(error(400, 'Bad request (too big limit value)'));
        }

        //validate session and key
        sess_obj.isValidSession(sessionId, function (err, obj) {

            //if something wrong
            if (err) {
                return next(err);
            }

            if (tagName) {
                searchByTagName(tagName, limit, page, function (err2, listObj) {
                    renderPosts(req, res, next, err2, listObj);
                });
            }
            else if (newest) {
                searchNew(limit, page, function (err2, listObj) {
                    renderPosts(req, res, next, err2, listObj);
                });
            }
            else {
                searchPopular(limit, page, function (err2, listObj) {
                    renderPosts(req, res, next, err2, listObj);
                });
            }
        });
    }
};

//private
var renderPosts = function (req, res, next, err2, listObj) {

    if (err2) {
        return next(err2);
    }

    var
        posts = require(process.env.APP_PATH + "/models/response/posts").posts;

    new posts(listObj, function (err3, data) {
        if (err3) {
            return next(err3);
        }

        res.json(data);
        RequestLogger.log(req, data);
    });
};

var searchByTagName = function (tagName, limit, page, callback) {

    var
        Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
        postList = new Post_List();

    return postList.getByTag(tagName, limit, page, callback);
};

var searchPopular = function (limit, page, callback) {

    var
        Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
        postList = new Post_List();

    return postList.getByRate(limit, page, callback);
};

var searchNew = function (limit, page, callback) {

    var
        Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
        postList = new Post_List();

    return postList.getNew(limit, page, callback);
};

var getStringParam = function (query, paramName) {
    var
        param = query[paramName] || "";

    return sanitize.escape(param);
};

var getIntegerParam = function (query, paramName, defaultValue) {
    if (!defaultValue) {
        defaultValue = 0;
    }

    return ~~(query[paramName]) || defaultValue;
};

var isEmptyJson = function (obj) {
    if (!obj) {
        return true;
    }

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }

    return true;
};

var getJsonBodyData = function (req) {
    return req.body || {};
};

module.exports = Posts_Controller;
secure.secureMethods(module.exports);
