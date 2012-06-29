var
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Tag = function (tagName)
{
  log.debug('Tag.construct(' + tagName + ')');

  this.tagName = tagName;

  this.update = function (callback) {
    log.debug('Tag.update()');

    //async
    Database.addValueToSet(Tag.getTagsSetName(), this.tagName, function (err, res) {

      if (err) {
        log.crit(err);
      }
    });

    this.updateKeywords(callback);
  };

  this.updateKeywords = function (callback) {
    log.debug('Tag.updateKeywords()');

    //create tag keywords for searcing by tag name
    var
      Tag_Keyword = require(process.env.APP_PATH + "/models/tag/keyword").Tag_Keyword,
      tagKeyword = new Tag_Keyword();

    tagKeyword.updateKeywords(this.tagName, callback);
  };

  //get list from score set
  this.getTags = function (searchKey, limit, page, callback) {
    log.debug('Tag.getTags(' + searchKey + ', ' + limit + ', ' + page + ')');

    var
      setName = '',
      offset = ~~((page - 1) * limit);

    if (searchKey) {
      setName = Tag.getTagKeywordSetName(searchKey);    //if given tag name then looking for
    }
    else {
      setName = Tag.getTagsSetName(); //get from all
    }

    //count all new posts
    Database.countValuesInSet(setName, function (errCount, count) {

      if (errCount) {
        return callback(errCount, null);
      }

      if (!count) {
        return callback(error(601, 'Empty tags result for given params'), null);
      }

      //get tags
      Database.getSortedValuesFromSet(setName, offset, limit, 'DESC', function (err, resList) {

        if (err) {
          return callback(err, null);
        }

        var
          List = require(process.env.APP_PATH + "/models/list").List,
          list = new List(limit, page, count, resList);

        return callback(null, list);
      });
    });
  };
};


//static
Tag.getTagsSetName = function () {
  return 'tags:all';
};

Tag.getTagKeywordSetName = function (tagName) {
  return 'tags:' + tagName;
};

exports.Tag = Tag;
secure.secureMethods(exports);
