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
    log.debug('Post_List.getObjectsFromIds()');

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

  //get posts by rate
  this.getByRate = function (limit, page, callback) {
    log.debug('Post_List.getByRate(' + limit + ', ' + page + ')');

    var
      _this = this,
      offset = parseInt((page - 1) * limit);

    //get post ids
    Database.getObjectScoreList(this, '__rate', offset, (offset + limit), function (err, resList) {

      if (err) {
        return callback(err, null);
      }

      if (!resList.length) {
        return callback(error(601, 'Empty posts result for given params'), null);
      }

      //get post objects from ids
      _this.getObjectsFromIds(resList, function (err2, data) {

        if (err2) {
          return callback(err2, null);
        }

        //we now got posts data

        //get count for listing
        Database.getObjectScoreCount(_this, '__rate', -1, -1, function (err3, count) {
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

  //get posts by tag name ordered by id desc
  this.searchByTag = function (tagName, page, limit, callback) {
    log.debug('Post_List.get(' + tagName + ', ' + page + ', ' + limit + ')');

    var
      _this = this,
      setName = tagName + ':postId',
      offset = parseInt((page - 1) * limit);

    //check how many items on list for tag
    Database.countValuesInSet(setName, function (errCount, count) {

      if (errCount) {
        return callback(errCount, null);
      }

      //get post ids for tag name
      Database.getSortedValuesFromSet(setName, offset, limit, 'DESC', function (errSearch, resList) {

        if (errSearch) {
          return callback(errSearch, null);
        }

        //get post objects from ids
        _this.getObjectsFromIds(resList, function (err2, data) {

          if (err2) {
            return callback(err2, null);
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
