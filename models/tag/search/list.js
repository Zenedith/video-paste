var
  Tag_Search = require(process.env.APP_PATH + "/models/tag/search").Tag_Search,
  List = require(process.env.APP_PATH + "/models/list").List,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Tag_Search_List = function ()
{
  log.debug('Tag_Search_List.construct()');

  Tag_Search.call(this);  //call parent constructor

  this.get = function (searchKey, limit, page, callback) {
    log.debug('Tag_Search_List.get(' + searchKey + ', ' + limit + ', ' + page + ')');

    var
      _this = this,
      offset = parseInt((page - 1) * limit)
      setName = searchKey + ':tags';

    //get tags matching to searchKey
    if (searchKey) {

      Database.getValuesFromSet(setName, function (err, data) {

        if (err) {
          return callback(err, null);
        }

        var
          count = data.length;  //we got all items from set here

        if (data.length > 0) {
          data = data.slice(offset, (offset + limit));  //get limited result
        }

//TODO throw error?
//        else  {
//          return callback(error(601, 'Empty tags results'), null);
//        }

          var
            list = new List(limit, page, count, data);

          return callback(null, list);
      });
    }
    //if no search key, then get all tags
    else {
      //get all tags
      Database.getObjectScoreList(this, 'tags', offset, (offset + limit), function (err, data) {

      if (err) {
        return callback(err, null);
      }

//TODO throw error?
//      if (!data.length) {
//        return callback(error(601, 'Empty posts results'), null);
//      }

        //get count for listing
        Database.getObjectScoreCount(_this, 'tags', -1, -1, function (err3, count) {
          if (err3) {
            return callback(err3, null);
          }

          var
            list = new List(limit, page, count, data);

          return callback(null, list);
        });
      });
    }
  };
};


//extending base class
Tag_Search_List.prototype.__proto__ = Tag_Search.prototype;


exports.Tag_Search_List = Tag_Search_List;
secure.secureMethods(exports);
