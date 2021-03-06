var
    Base = require(process.env.APP_PATH + "/models/base").Base,
    log = require(process.env.APP_PATH + "/lib/log"),
    Database = require(process.env.APP_PATH + "/lib/database").Database,
//  util = require("util"),
    secure = require("node-secure");

var Post = function () {
    log.debug('Post.construct()');

    this.__className = "Post";
    this.__added = 0;
    this.__userId = 0;

    this.createNewPost = function (videoObj, tags, userId, callback) {
        log.debug('Post.createNewPost()');

        if (!userId) {
            return callback(error(401, 'Missing userId'), null);
        }

        this.__added = Math.round(+new Date() / 1000);
        this.__userId = ~~(userId);

        Database.saveObject(this, function (err, p_obj) {

            if (err) {
                return callback(err, null);
            }

            var
                postId = ~~(p_obj.getId());

            //save video info for given postId
            videoObj.saveForPost(postId, function (err2, v_obj) {

                if (err2) {
                    return callback(err2, null);
                }

                var
                    tagsLen = tags.length,
                    Post_Tag = require(process.env.APP_PATH + "/models/post/tag").Post_Tag,
                    Post_Rate = require(process.env.APP_PATH + "/models/post/rate").Post_Rate,
                    Post_Views = require(process.env.APP_PATH + "/models/post/views").Post_Views,
                    postViews = new Post_Views(postId),
                    postRate = new Post_Rate(postId);

                //async: add user to already rated this post (has posted it)
                postRate.rate(1, p_obj.getUserId(), function (err2, res2) {
                    if (err2) {
                        log.critical(err2);
                    }
                });

                //async: update tags
                for (var i = 0; i < tagsLen; ++i) {

                    var
                        postTag = new Post_Tag(tags[i]);

                    postTag.addToPost(postId, function (err3, res3) {
                        if (err3) {
                            log.critical(err3);
                        }
                    });
                }

                //async: create views counter
                postViews.createCounter(function (err4, res4) {
                    if (err4) {
                        log.critical(err4);
                    }
                });

                //async: add post to new set
                p_obj.addPostToNew(function (err5, res5) {
                    if (err5) {
                        log.critical(err5);
                    }
                });

                //return, created object, don't wait for async methods
                return callback(null, p_obj);
            });
        });
    };

    this.addPostToNew = function (callback) {
        var
            Post_List_New = require(process.env.APP_PATH + "/models/post/list/new").Post_List_New;

        Database.addValueToSet(Post_List_New.setNameNew, this.getId(), callback);
    };

    this.getAddedTimestamp = function () {
        return ~~(this.__added) || 0;
    };

    this.getUserId = function () {
        return ~~(this.__userId) || 0;
    };
};

//override: get int id value
Post.prototype.getId = function () {
    return ~~(this.__id);
};


Post.prototype.getObjectsFromIds = function (ids, callback) {
    log.debug('Post.getObjectsFromIds()');

    this.loadMany(ids, function (err, resList) {
        if (err) {
            return callback(err, null);
        }

        var
            data = [];

        for (var lp in resList) {
            if (resList.hasOwnProperty(lp)) {
                var
                    post = new Post();

                for (var k in resList[lp]) {
                    if (resList[lp].hasOwnProperty(k)) {
                        post[k] = resList[lp][k];
                    }
                }

                data.push(post);
            }
        }

        return callback(null, data);
    });
};

//extending base class
//util.inherits(Post, Base);
Post.prototype.__proto__ = Base.prototype;


exports.Post = Post;
secure.secureMethods(exports);
