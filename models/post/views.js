var
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Post_Views = function (postId)
{
  log.debug('Post_Views.construct(' + postId + ')');

  this.postId = postId;

  this.createCounter = function (callback) {
    log.debug('Post_Views.createCounter()');
    Database.changeScoreValue(Post_Views.scoreNameViews, this.postId, 0, callback); // only add to score set!
  };

  this.views = function (callback) {
    log.debug('Post_Views.views()');

    var
      _this = this;

    //change score and callback
    Database.isValueInScore(Post_Views.scoreNameViews, this.postId, function (err, elemIndex) {
      if (err) {
        return callback(err, null);
      }

      if (elemIndex === null) {
        return callback(error(400, 'Bad request (bad postId value)'), null);
      }

      Database.changeScoreValue(Post_Views.scoreNameViews, _this.postId, 1, callback); // +1 for views
    });
  };
};

//static
Post_Views.scoreNameViews = 'posts:views:score'; //define sorted set name for post rate score

exports.Post_Views = Post_Views;
secure.secureMethods(exports);
