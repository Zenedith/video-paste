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
  this.__rate = 0;
  this.__views = 0;

  this.createNewPost = function (url, categoryId, userId, callback) {
    log.debug('Post.createNewPost()');

//    if (!userId) {
//      callback(error(401, 'Brak autora'), null);
//      return false;
//    }

    this.__url = url;
    this.__categoryId = categoryId || 0;
    this.__added = Math.round(+new Date()/1000);
    this.__userId = userId;

    Database.save(this, function (err, p_obj) {

      if (err) {
        return callback(err, p_obj);
      }

      //add score for post
      Database.addScore(p_obj, '__rate', function (err2, res) {
        return callback(err, p_obj);
      });

    });
  };

  this.rate = function (id, rate, callback) {
    this.setId(id);

    var
      add_score_callback = function (err, p_obj) {

      if (err) {
        return callback(err, p_obj);
      }

      //add score for post
      Database.addScore(p_obj, '__rate', function (err2, res) {
        return callback(err, p_obj);
      });

    };

    if (rate > 0) {
      Database.incr(this, '__rate', add_score_callback);
    }
    else if (rate < 0) {
      Database.decr(this, '__rate', add_score_callback);
    }

  };

  this.views = function (id, callback) {
    this.setId(id);
    Database.incr(this, '__views', callback);
  };

  this.getCategoryId = function () {
    return parseInt(this.__categoryId || 0);
  };

  this.getAddedTimestamp = function () {
    return parseInt(this.__added || 0);
  };

  this.getUserId = function () {
    return parseInt(this.__userId || 0);
  };

  this.getUrl = function () {
    return this.__url;
  };

  this.getRating = function () {
    return parseInt(this.__rate || 0);
  };

  this.getViews = function () {
    return parseInt(this.__views || 0);
  };
};


//extending base class
//util.inherits(Post, Base);
Post.prototype.__proto__ = Base.prototype;


exports.Post = Post;
secure.secureMethods(exports);
