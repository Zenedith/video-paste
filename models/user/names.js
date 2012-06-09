var
  User = require(process.env.APP_PATH + "/models/user").User,
  user = new User();
  secure = require("node-secure");

var User_Names = function(idsObj, callback) {

  this.userNames = {};

  var
    _this = this;

  user.getNamesByIds(Object.keys(idsObj), function (err, userNames) {
    _this.userNames = userNames;
    return callback(err, _this);
  });

  this.getName = function (id) {
    if (this.userNames.hasOwnProperty(id) && this.userNames[id]) {
      return this.userNames[id];
    }

    return '';
  };
};

exports.User_Names = User_Names;
secure.secureMethods(exports);
