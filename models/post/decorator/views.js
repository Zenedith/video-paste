var
  Post_Views = require(process.env.APP_PATH + "/models/post/views").Post_Views,
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Post_Decorator_Views = function(idsObj, callback) {

  this.postViews = {};

  var
    ids = Object.keys(idsObj),
    idsLen = ids.length,
    _this = this;

  if (idsLen) {
    Database.getScoreForManyValues(Post_Views.scoreNameViews, ids, function (err, postViews) {
      if (err) {
        return callback(err, null);
      }

      _this.postViews = postViews;
      return callback(null, _this);
    });
  }
  else {
    return callback(null, _this);
  }

  this.getViews = function (id) {
    if (this.postViews.hasOwnProperty(id) && this.postViews[id]) {
      return this.postViews[id];
    }

    return 1;
  };
};

exports.Post_Decorator_Views = Post_Decorator_Views;
secure.secureMethods(exports);
