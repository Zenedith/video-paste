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
  this.__authorId = 0;
  this.__url = '';
  this.__rate = 0;
  this.__views = 0;

  this.createNewPost = function (url, categoryId, authorId, callback) {
    log.debug('Post.createNewPost()');

//    if (!authorId) {
//      callback(error(601, 'Brak autora'), null);
//      return false;
//    }

    this.__url = url;
    this.__categoryId = categoryId || 0;
    this.__added = Math.round(+new Date()/1000);
    this.__authorId = authorId;

    Database.save(this, callback);
  };

  this.load = function (id, callback) {
    this.setId(id);
    Database.load(this, callback);
  };

  this.rate = function (id, rate, callback) {
    this.setId(id);
    Database.incr(this, '__rate', callback);
  };

  this.views = function (id, callback) {
    this.setId(id);
    Database.incr(this, '__views', callback);
  };

  this.getCategoryId = function () {
    return this.__categoryId;
  };

  this.getAddedTimestamp = function () {
    return this.__added;
  };

  this.getAuthorId = function () {
    return this.__authorId;
  };

  this.getUrl = function () {
    return this.__url;
  };

  this.getRating = function () {
    return this.__rate;
  };

  this.getViews = function () {
    return this.__views;
  };
};


//extending base class
//util.inherits(Post, Base);
Post.prototype.__proto__ = Base.prototype;


exports.Post = Post;
secure.secureMethods(exports);
