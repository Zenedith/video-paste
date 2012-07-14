var
  log = require(process.env.APP_PATH + "/lib/log"),
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Post_Rate = function (postId)
{
  log.debug('Post_Rate.construct(' + postId + ')');

  //local object variable!
  var
    setNameRated = 'post:' + postId + ':rated'; //define set name for users

  this.postId = postId;

  //rate post [callback(err, rateValue)]
  this.rate = function (rate, userId, callback) {
    log.debug('Post_Views.rate(' + rate + ', ' + userId + ')');

    if (rate > 0) {
      rate = 1;
    }
    else if (rate < 0) {
      rate = -1;
    }
    else {
      return callback(error(400, 'Bad Request (rate)'), null);
    }

    var
      _this = this;

    //check if user rated before
    this.checkIfUserAlreadyRated(userId, function (err, res) {

      if (err) {
        return callback(err, null);
      }

      //if userId already in set
      if (res > 0) {
        return callback(error(604, 'Already rated from given userId'), null);
      }

      //async: set as rated from userId
      _this.addUserToAlreadyRatedSet(userId, function (err2, res) {

        if (err2) {
          log.critical(err2);
        }
      });

      //change score and callback
      Database.changeScoreValue(Post_Rate.scoreNameRated, _this.postId, rate, callback);
    });

  };

  this.addUserToAlreadyRatedSet = function (userId, callback) {
    Database.addValueToSet(setNameRated, userId, callback);
  };

  this.checkIfUserAlreadyRated = function (userId, callback) {
    Database.isValueInSet(setNameRated, userId, callback);
  };

  this.getRating = function (callback) {
    Database.getScoreForValue(setNameRated, this.postId, callback);
  };
};

//static
Post_Rate.scoreNameRated = 'posts:rate:score'; //define sorted set name for post rate score

exports.Post_Rate = Post_Rate;
secure.secureMethods(exports);
