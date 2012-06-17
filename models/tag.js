var
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  sanitize = require('validator').sanitize,
  check = require('validator').check,
  secure = require("node-secure");

var Tag = function ()
{
  log.debug('Tag.construct()');

  this.addTag = function (tagName, postId, callback) {
    log.debug('Tag.updateTagScore(' + tagName + ', ' + postId + ')');

    tagName = sanitize(tagName).xss();

    try {
      check(tagName).notEmpty().len(3, 25);
    }
    catch (e) {
      return callback(error(606, 'invalid tagName: ' + e.message), null);
    }

    var
      listName = postId + ':tags',
      setName = tagName + ':postId';

    //add postId to set connected with tagName
    Database.addValueToSet(setName, postId, function (err, res){
      if (err) {
        return callback(err, null);
      }

      //async
      Database.appendValueToList(listName, tagName, function (err4, res4) {
        if (err4) {
          log.crit(err4);
        }
      });

      //create search keys from tag name
      var
        Tag_Search = require(process.env.APP_PATH + "/models/tag/search").Tag_Search,
        tagSearch = new Tag_Search();

      return tagSearch.updateKeywords(tagName, callback);
    });
  };

  this.getTags = function (postId, callback) {
    var
      listName = postId + ':tags';

    Database.getValuesFromList(listName, 0, -1, callback);
  };
};

exports.Tag = Tag;
secure.secureMethods(exports);
