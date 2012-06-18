var
  Base = require(process.env.APP_PATH + "/models/base").Base,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
//  util = require("util"),
  secure = require("node-secure");

var Post = function ()
{
  log.debug('Post.construct()');

  this.__className = "Post";
  this.__categoryId = 0;
  this.__added = 0;
  this.__userId = 0;
  this.__url = '';
  this.__thumbUrl = null,

  this.createNewPost = function (urlObj, categoryId, tags, userId, callback) {
    log.debug('Post.createNewPost()');

    if (!userId) {
      return callback(error(401, 'Missing userId'), null);
    }

    this.__url = urlObj.get();
    this.__thumbUrl = urlObj.getThumbUrl();
    this.__categoryId = parseInt(categoryId) || 0;
    this.__added = Math.round(+new Date()/1000);
    this.__userId = parseInt(userId);

    Database.saveObject(this, function (err, p_obj) {

      if (err) {
        return callback(err, null);
      }

      var
        postId = p_obj.getId(),
        tagsLen = tags.length,
        Post_Tag = require(process.env.APP_PATH + "/models/post/tag").Post_Tag,
        Post_Rate = require(process.env.APP_PATH + "/models/post/rate").Post_Rate,
        Post_Views = require(process.env.APP_PATH + "/models/post/views").Post_Views,
        postViews = new Post_Views(postId),
        postRate = new Post_Rate(postId);

      //async: add user to already rated this post (has posted it)
      postRate.rate(1, p_obj.getUserId(), function (err2, res2) {
        if (err2) {
          log.crit(err2);
        }
      });

      //async: update tags
      for (var i = 0; i < tagsLen; ++i) {

        var
          postTag = new Post_Tag(tags[i]);

        postTag.addToPost(postId, function (err3, res3) {
          if (err3) {
            log.crit(err3);
          }
        });
      }

      //async: create views counter
      postViews.createCounter(function (err4, res4) {
        if (err4) {
          log.crit(err4);
        }
      });

      //async: add post to new set
      p_obj.addPostToNew(function (err5, res5) {
        if (err5) {
          log.crit(err5);
        }
      });

      //return, created object, don't wait for async methods
      return callback(null, p_obj);
    });
  };

  this.addPostToNew = function (callback) {
    var
      Post_List_New = require(process.env.APP_PATH + "/models/post/list/new").Post_List_New;

    Database.addValueToSet(Post_List_New.setNameNew, this.getId(), callback);
  };

  this.getCategoryId = function () {
    return parseInt(this.__categoryId) || 0;
  };

  this.getAddedTimestamp = function () {
    return parseInt(this.__added) || 0;
  };

  this.getUserId = function () {
    return parseInt(this.__userId) || 0;
  };

  this.getUrl = function () {
    return this.__url;
  };

  this.getThumbUrl = function () {

    //if no thumb, then try to get it
    if (this.__thumbUrl === null) {
      var
        Url = require(process.env.APP_PATH + "/models/url").Url,
        urlObj = new Url(this.getUrl());

      this.__thumbUrl = urlObj.getThumbUrl();
    }

    return this.__thumbUrl;
  };

};

//override: get int id value
Post.prototype.getId = function () {
  return parseInt(this.__id);
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
      var
        post = new Post();

      for (var k in resList[lp]) {
        post[k] = resList[lp][k];
      }

      data.push(post);
    }

    return callback(null, data);
  });
};

//extending base class
//util.inherits(Post, Base);
Post.prototype.__proto__ = Base.prototype;


exports.Post = Post;
secure.secureMethods(exports);
