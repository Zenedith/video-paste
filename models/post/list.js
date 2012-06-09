var
  Post = require(process.env.APP_PATH + "/models/post").Post,
  List = require(process.env.APP_PATH + "/models/list").List,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
//  util = require("util"),
  secure = require("node-secure");

var Post_List = function ()
{
  log.debug('Post_List.construct()');

  Post.call(this);  //call parent constructor

  this.getObjectsFromIds = function (ids, callback) {
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

  this.get = function (limit, page, callback) {
    log.debug('Post_List.get(' + limit + ', ' + page + ')');

    var
      _this = this,
      offset = parseInt((page - 1) * limit);

//    console.log('offset: ' + offset, (offset + limit - 1));

    //get post ids
    Database.getScoreList(this, '__rate', offset, (offset + limit), function (err, resList) {

      if (err) {
        return callback(err, null);
      }

      if (!resList.length) {
        return callback(error(601, 'Empty posts results'), null);
      }

      //get post objects from ids
      _this.getObjectsFromIds(resList, function (err2, data) {

        if (err2) {
          return callback(err2, null);
        }

        //we now got posts data

        //get count for listing
        Database.getScoreCount(_this, '__rate', -1, -1, function (err3, count) {
          if (err3) {
            return callback(err3, null);
          }

          var
            list = new List(limit, page, count, data);

          return callback(null, list);
        });
      });
    });
  };
};


//extending base class
//util.inherits(Post_List, Post);
Post_List.prototype.__proto__ = Post.prototype;


exports.Post_List = Post_List;
secure.secureMethods(exports);
