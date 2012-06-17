var
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  sanitize = require('validator').sanitize,
  check = require('validator').check,
  secure = require("node-secure");

var Tag = function (tagName)
{
  log.debug('Tag.construct(' + tagName + ')');

  this.tagName = sanitize(tagName).xss();

  this.addToPost = function (postId, callback) {
    log.debug('Tag.addToPost(' + postId + ')');

    try {
      check(this.tagName).notEmpty().len(3, 25);
    }
    catch (e) {
      return callback(error(606, 'invalid tagName: ' + e.message), null);
    }

    var
      _this = this,
      listName = postId + ':tags',
      setName = this.tagName + ':postId';

    //add postId to set connected with tagName
    Database.addValueToSet(setName, postId, function (err, res) {
      if (err) {
        return callback(err, null);
      }

      //async
      Database.appendValueToList(listName, _this.tagName, function (err4, res4) {
        if (err4) {
          log.crit(err4);
        }
      });

      //create search keys from tag name
      var
        Tag_Search = require(process.env.APP_PATH + "/models/tag/search").Tag_Search,
        tagSearch = new Tag_Search();

      return tagSearch.updateKeywords(_this.tagName, callback);
    });
  };
};

exports.Tag = Tag;
secure.secureMethods(exports);
