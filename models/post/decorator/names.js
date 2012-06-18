var
  User = require(process.env.APP_PATH + "/models/user").User,
  user = new User();
  secure = require("node-secure");

var Post_Decorator_Names = function(idsObj, callback) {

  this.userNames = {};

  var
    ids = Object.keys(idsObj),
    idsLen = ids.length,
    _this = this;

  if (idsLen) {
    user.getNamesByIds(ids, function (err, userNames) {
      if (err) {
        return callback(err, null);
      }

      _this.userNames = userNames;
      return callback(null, _this);
    });
  }
  else {
    return callback(null, _this);
  }

  this.getName = function (id) {
    if (this.userNames.hasOwnProperty(id) && this.userNames[id]) {
      return this.userNames[id];
    }

    return '';
  };
};

exports.Post_Decorator_Names = Post_Decorator_Names;
secure.secureMethods(exports);
