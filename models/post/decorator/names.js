var
  User = require(process.env.APP_PATH + "/models/user").User,
  user = new User();
  secure = require("node-secure");

var Post_Decorator_Names = function(idsObj) {

  this.userNames = {};

  var
    ids = Object.keys(idsObj),
    idsLen = ids.length;

  this.prepareKeys = function () {
    var
      ids = Object.keys(idsObj),
      idsLen = ids.length,
      classname = user.getClassName(),
      field = '__name',
      keyFields = [];

    if (idsLen) {

      for (var i = 0; i < idsLen; ++i) {
        var
          key = [classname, ids[i], field];

        keyFields.push(key);
      }
    }

    return {'get' : keyFields};
  };

  this.load = function (data) {
    if (idsLen) {
      for (var i = 0; i < idsLen; ++i) {
        this.userNames[ids[i]] = data.pop();
      }
    }
  };

  this.getName = function (id) {
    if (this.userNames.hasOwnProperty(id) && this.userNames[id]) {
      return this.userNames[id];
    }

    return '';
  };
};

exports.Post_Decorator_Names = Post_Decorator_Names;
secure.secureMethods(exports);
