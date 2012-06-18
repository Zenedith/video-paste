var
  Post = require(process.env.APP_PATH + "/models/post").Post,
  postObj = new Post();
  List = require(process.env.APP_PATH + "/models/list").List,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Post_List = function ()
{
  log.debug('Post_List.construct()');

  //get list from score set
  this._getBySetName = function (setName, limit, page, callback) {
    log.debug('Post_List._getBySetName(' + setName + ', ' + limit + ', ' + page + ')');

    var
      offset = parseInt((page - 1) * limit);

    //count all new posts
    Database.countValuesInSet(setName, function (errCount, count) {

      if (errCount) {
        return callback(errCount, null);
      }

      if (!count) {
        return callback(error(601, 'Empty posts result for given params'), null);
      }

      //get posts ids
      Database.getSortedValuesFromSet(setName, offset, limit, 'DESC', function (err, resList) {

        if (err) {
          return callback(err, null);
        }

        //get post objects from ids
        postObj.getObjectsFromIds(resList, function (err2, data) {

          if (err2) {
            return callback(err2, null);
          }

          //we now got posts data

          var
            list = new List(limit, page, count, data);

          return callback(null, list);
        });
      });
    });
  };

  //get list from score set
  this._getByScoreSet = function (scoreSetName, limit, page, callback) {
    log.debug('Post_List._getByScoreSet(' + scoreSetName + ', ' + limit + ', ' + page + ')');

    var
      offset = parseInt((page - 1) * limit);

    //get post ids
    Database.getScoreList(scoreSetName, offset, (offset + limit), function (err, resList) {

      if (err) {
        return callback(err, null);
      }

      if (!resList.length) {
        return callback(error(601, 'Empty posts result for given params'), null);
      }

      //get post objects from ids
      postObj.getObjectsFromIds(resList, function (err2, data) {

        if (err2) {
          return callback(err2, null);
        }

        //we now got posts data

        //get count for listing
        Database.getCountScoreList(scoreSetName, -1, -1, function (err3, count) {
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

Post_List.prototype.getNew = function (limit, page, callback) {
  log.debug('Post_List.getNew(' + limit + ', ' + page + ')');

  var
    Post_List_New = require(process.env.APP_PATH + "/models/post/list/new").Post_List_New;

  this._getBySetName(Post_List_New.setNameNew, limit, page, callback);
};

Post_List.prototype.getByRate = function (limit, page, callback) {
  log.debug('Post_List.getByRate(' + limit + ', ' + page + ')');

  var
    Post_Rate = require(process.env.APP_PATH + "/models/post/rate").Post_Rate;

  this._getByScoreSet(Post_Rate.scoreNameRated, limit, page, callback);
};

Post_List.prototype.getByTag = function (tagName, limit, page, callback) {
  log.debug('Post_List.getByTag(' + tagName + ', ' + limit + ', ' + page + ')');

  var
    Post_Tag = require(process.env.APP_PATH + "/models/post/tag").Post_Tag,
    setName = Post_Tag.getTagPostsSetName(tagName);

  this._getBySetName(setName, limit, page, callback);
};

//get posts by tag name ordered by id desc
Post_List.prototype.searchByTag = function (tagName, limit, page, callback) {
  log.debug('Post_List.searchByTag(' + tagName + ', ' + limit + ', ' + page + ')');

  var
    Post_Tag = require(process.env.APP_PATH + "/models/post/tag").Post_Tag,
    setName = Post_Tag.getTagPostsSetName(tagName);

  this._getBySetName(setName, limit, page, callback);
};

exports.Post_List = Post_List;
secure.secureMethods(exports);
