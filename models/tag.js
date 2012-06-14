var
  Base = require(process.env.APP_PATH + "/models/base").Base,
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  sanitize = require('validator').sanitize,
  check = require('validator').check,
  secure = require("node-secure");

var Tag = function ()
{
  log.debug('Tag.construct()');

  this.__className = "Tag";

  this.addTag = function (tagName, postId, callback) {
    log.debug('Tag.updateTagScore(' + tagName + ', ' + postId + ')');

    tagName = sanitize(tagName).xss();

    try {
      check(tagName).notEmpty().len(3, 25);
    }
    catch (e) {
      return callback(error(606, 'invalid tagName: ' + e.message), null);
    }

    this.setId(tagName);  //tag name as id

    //add postId to set connected with tagName
    Database.addToObjectSet(this, 'postId', postId, function (err, res){
      if (err) {
        return callback(err, null);
      }

      //create search keys from tag name
      var
        Tag_Search = require(process.env.APP_PATH + "/models/tag/search").Tag_Search,
        tagSearch = new Tag_Search();

      return tagSearch.updateKeywords(tagName, callback);
    });
  };
};


//extending base class
Tag.prototype.__proto__ = Base.prototype;


exports.Tag = Tag;
secure.secureMethods(exports);
