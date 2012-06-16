var
  Post_List = require(process.env.APP_PATH + "/models/post/list").Post_List,
  List = require(process.env.APP_PATH + "/models/list").List,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
//  util = require("util"),
  secure = require("node-secure");

var Post_List_New = function ()
{
  log.debug('Post_List_New.construct()');

  Post_List.call(this);  //call parent constructor

  this.get = function (limit, page, callback) {
    log.debug('Post_List_New.get(' + limit + ', ' + page + ')');

    var
      _this = this,
      offset = parseInt((page - 1) * limit);

    //count all new posts
    Database.countValuesInSet('new:posts', function (errCount, count) {

      if (errCount) {
        return callback(errCount, null);
      }

      if (!count) {
        return callback(error(601, 'Empty new posts result for given params'), null);
      }

      //get new post ids
      Database.getSortedValuesFromSet('new:posts', offset, limit, 'DESC', function (err, resList) {

        if (err) {
          return callback(err, null);
        }

        //get post objects from ids
        _this.getObjectsFromIds(resList, function (err2, data) {

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
};


//extending base class
//util.inherits(Post_List_New, Post_List);
Post_List_New.prototype.__proto__ = Post_List.prototype;


exports.Post_List_New = Post_List_New;
secure.secureMethods(exports);
