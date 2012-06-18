var
  Post_Rate = require(process.env.APP_PATH + "/models/post/rate").Post_Rate,
  Database = require(process.env.APP_PATH + "/lib/database").Database,
  secure = require("node-secure");

var Post_Decorator_Rate = function(idsObj, callback) {

  this.postRates = {};

  var
    ids = Object.keys(idsObj),
    idsLen = ids.length,
    _this = this;

  if (idsLen) {
    Database.getScoreForManyValues(Post_Rate.scoreNameRated, ids, function (err, postRates) {
      if (err) {
        return callback(err, null);
      }

      _this.postRates = postRates;
      return callback(null, _this);
    });
  }
  else {
    return callback(null, _this);
  }

  this.getRate = function (id) {
    if (this.postRates.hasOwnProperty(id) && this.postRates[id]) {
      return this.postRates[id];
    }

    return 1;
  };
};

exports.Post_Decorator_Rate = Post_Decorator_Rate;
secure.secureMethods(exports);
