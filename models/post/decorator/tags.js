var
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  Post_Tag = require(process.env.APP_PATH + "/models/post/tag").Post_Tag,
  secure = require("node-secure");

var Post_Decorator_Tags = function(idsObj, callback) {

  this.postsTags = {};

  var
    listNames = [],
    start = 0,
    stop = -1,
    ids = Object.keys(idsObj),
    idsLen = ids.length,
    _this = this;

  if (idsLen) {

    for (var lp = 0; lp < idsLen; ++lp) {
      var
        listName = Post_Tag.getPostTagsListName(ids[lp]);

      listNames.push(listName);
    }

    Database.getManyValuesFromLists(listNames, start, stop, function (err, postsTags) {
      if (err) {
        return callback(err, null);
      }

      //base on idsLen rather than postsTags (this *must* be this same)
      for (var lp = 0; lp < idsLen; ++lp) {
        var
          postId = ids[lp],
          listName = Post_Tag.getPostTagsListName(postId),
          postTags = postsTags[listName];

        _this.postsTags[postId] = postTags;
      }

      return callback(null, _this);
    });
  }
  else {
    return callback(null, _this);
  }

  this.getTags = function (id) {
    if (this.postsTags.hasOwnProperty(id) && this.postsTags[id]) {
      return this.postsTags[id];
    }

    return [];
  };
};

exports.Post_Decorator_Tags = Post_Decorator_Tags;
secure.secureMethods(exports);
