var
  Post_Views = require(process.env.APP_PATH + "/models/post/views").Post_Views,
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Post_Decorator_Views = function(idsObj, callback) {

  this.postViews = {};

  var
    ids = Object.keys(idsObj),
    idsLen = ids.length;

  this.prepareKeys = function () {
    var
      scoreSetName = Post_Views.scoreNameViews,
      keyFields = [];

    if (idsLen) {

      for (var i = 0; i < idsLen; ++i) {
        var
          key = [scoreSetName, ids[i]];

        keyFields.push(key);
      }
    }

    return {'zscore' : keyFields};
  };

  this.load = function (data) {
    if (idsLen) {
      for (var i = 0; i < idsLen; ++i) {
        this.postViews[ids[i]] = data.pop();
      }
    }
  };


  this.getViews = function (id) {
    if (this.postViews.hasOwnProperty(id) && this.postViews[id]) {
      return this.postViews[id];
    }

    return 1;
  };
};

exports.Post_Decorator_Views = Post_Decorator_Views;
secure.secureMethods(exports);
