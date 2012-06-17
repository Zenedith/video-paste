var
  Base = require(process.env.APP_PATH + "/models/base").Base,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
//  util = require("util"),
  secure = require("node-secure");

var Post = function ()
{
  log.debug('Post.construct()');

  const ALREADY_RATED_FIELD_NAME = 'israted';

  this.__className = "Post";
  this.__categoryId = 0;
  this.__added = 0;
  this.__userId = 0;
  this.__url = '';
  this.__thumbUrl = null,
  this.__rate = 1;
  this.__views = 0;

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
    this.__rate = 1;

    Database.saveObject(this, function (err, p_obj) {

      if (err) {
        return callback(err, null);
      }

      var
        Tag = require(process.env.APP_PATH + "/models/tag").Tag;

      //async: add user to already rated this post (has posted it)
      p_obj.addUserToAlreadyRatedSet(p_obj.getUserId(), function (err2, res) {
        if (err2) {
          log.crit(err2);
        }
      });

      //async: update tags
      for (var i in tags) {
        var
          postId = p_obj.getId(),
          tag = new Tag();

        tag.addTag(tags[i], postId, function (err3, res3) {
          if (err3) {
            log.crit(err3);
          }
        });
      }

      //async: add score for post
      Database.addObjectScore(p_obj, '__rate', function (err4, res4) {
        if (err4) {
          log.crit(err4);
        }
      });

      //async: add post to new set
      p_obj.addPostToNewSet(function (err5, res5) {
        if (err5) {
          log.crit(err5);
        }
      });

      //return, created object, don't wait for async methods
      return callback(null, p_obj);
    });
  };

  this.rate = function (id, rate, userId, callback) {
    this.setId(id);

    //define callback to incr or decr method
    var
      _this = this,
      add_score_callback = function (err, p_obj) {

      if (err) {
        return callback(err, null);
      }

      //add score for post
      Database.addObjectScore(p_obj, '__rate', function (err2, res) {

        if (err2) {
          return callback(err2, null);
        }

        //async: set as rated from userId
        p_obj.addUserToAlreadyRatedSet(userId, function (err3, res) {
          if (err3) {
            log.crit(err3);
          }
        });

        //dont wait to set rated
        return callback(null, p_obj);
      });
    };

    //START
    //check if user rated before
    this.checkIfUserAlreadyRated(userId, function (err, res) {

      if (err) {
        return callback(err, null);
      }

      //if userId already in set
      if (res > 0) {
        return callback(error(604, 'Already rated from given userId'), null);
      }

      //check what to do based on rate param
      if (rate > 0) {
        Database.incrObject(_this, '__rate', add_score_callback);
      }
      else if (rate < 0) {
        Database.decrObject(_this, '__rate', add_score_callback);
      }
      else {
        return callback(error(400, 'Bad Request (rate)'), null);
      }
    });

  };

  this.views = function (id, callback) {
    this.setId(id);
    Database.incrObject(this, '__views', callback);
  };

  this.addPostToNewSet = function (callback) {
    var
      setName = 'new:posts';

    Database.addValueToSet(setName, this.getId(), callback);
  };

  this.addUserToAlreadyRatedSet = function (userId, callback) {
    var
      setName = 'post:' + this.getId() + ':rated';

    Database.addValueToSet(setName, userId, callback);
  };

  this.checkIfUserAlreadyRated = function (userId, callback) {
    var
      setName = 'post:' + this.getId() + ':rated';

    Database.isValueInSet(setName, userId, callback);
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

  this.getRating = function () {
    return parseInt(this.__rate) || 0;
  };

  this.getViews = function () {
    return parseInt(this.__views) || 0;
  };

};

//override: get int id value
Post.prototype.getId = function () {
  return parseInt(this.__id);
};


//extending base class
//util.inherits(Post, Base);
Post.prototype.__proto__ = Base.prototype;


exports.Post = Post;
secure.secureMethods(exports);
