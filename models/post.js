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
  this.__rate = 1;
  this.__views = 0;

  this.createNewPost = function (url, categoryId, userId, callback) {
    log.debug('Post.createNewPost()');

    if (!userId) {
      return callback(error(401, 'Missing userId'), null);
    }

    this.__url = url;
    this.__categoryId = parseInt(categoryId) || 0;
    this.__added = Math.round(+new Date()/1000);
    this.__userId = parseInt(userId);
    this.__rate = 1;

    Database.saveObject(this, function (err, p_obj) {

      if (err) {
        return callback(err, null);
      }

      //add user to already rated this post (has posted it)
      p_obj.addUserToAlreadyRatedSet(p_obj.getUserId(), function (err2, res) {

        if (err2) {
          return callback(err2, null);
        }

        //add score for post
        Database.addObjectScore(p_obj, '__rate', function (err3, res2) {
          return callback(err3, p_obj);
        });
      });

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

        p_obj.addUserToAlreadyRatedSet(userId, function (err3, res) {
          return callback(err3, p_obj);
        });
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

  this.addUserToAlreadyRatedSet = function (userId, callback) {
    Database.addToObjectSet(this, 'rated', userId, callback);
  };

  this.checkIfUserAlreadyRated = function (userId, callback) {
    Database.isObjectInSet(this, 'rated', userId, callback);
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

  this.getRating = function () {
    return parseInt(this.__rate) || 0;
  };

  this.getViews = function () {
    return parseInt(this.__views) || 0;
  };
};


//extending base class
//util.inherits(Post, Base);
Post.prototype.__proto__ = Base.prototype;


exports.Post = Post;
secure.secureMethods(exports);
