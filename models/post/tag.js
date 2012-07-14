var
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  sanitize = require('validator').sanitize,
  check = require('validator').check,
  secure = require("node-secure");

var Post_Tag = function (tagName)
{
  log.debug('Post_Tag.construct(' + tagName + ')');

  this.tagName = sanitize(tagName).xss();

  this.addToPost = function (postId, callback) {
    log.debug('Post_Tag.addToPost(' + postId + ')');

    try {
      check(this.tagName).notEmpty().len(3, 25);
    }
    catch (e) {
      return callback(error(606, 'invalid tagName: ' + e.message), null);
    }

    var
      _this = this;

    //add postId to set, connected with tagName
    Database.addValueToSet(Post_Tag.getTagPostsSetName(this.tagName), postId, function (err, res) {
      if (err) {
        return callback(err, null);
      }

      //async: add tag to post
      Database.appendValueToList(Post_Tag.getPostTagsListName(postId), _this.tagName, function (err2, res2) {
        if (err2) {
          log.critical(err2);
        }
      });

      //async: update tag info
      var
        Tag = require(process.env.APP_PATH + "/models/tag").Tag,
        tag = new Tag(_this.tagName);

      tag.update(function (err3, res3) {

        if (err3) {
          log.critical(err3);
        }
      });

      //don't wait for async
      return callback(null, true);
    });
  };
};

Post_Tag.getTagPostsSetName = function (tagName) {
  return 'tag:' + tagName + ':postId';
};

Post_Tag.getPostTagsListName = function (postId) {
  return 'post:' + postId + ':tags';
};

exports.Post_Tag = Post_Tag;
secure.secureMethods(exports);
