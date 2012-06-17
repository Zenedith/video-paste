var
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Post_Tags = function(idsObj, callback) {

  this.postsTags = {};

  var
    listNames = [],
    start = 0,
    stop = -1,
    ids = Object.keys(idsObj),
    idsLen = ids.length,
    _this = this;

  for (var lp = 0; lp < idsLen; ++lp) {
    var
      listName = ids[lp] + ':tags';

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
        listName = postId + ':tags',
        postTags = postsTags[listName];

      _this.postsTags[postId] = postTags;
    }

//    console.log(_this.postsTags);

    return callback(null, _this);
  });

  this.getTags = function (id) {
    if (this.postsTags.hasOwnProperty(id) && this.postsTags[id]) {
      return this.postsTags[id];
    }

    return [];
  };
};

exports.Post_Tags = Post_Tags;
secure.secureMethods(exports);
