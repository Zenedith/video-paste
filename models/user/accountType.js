var
  secure = require("node-secure");

var accountType = {
  FACEBOOK: 'facebook'
};

exports.accountType = accountType;
secure.secureMethods(exports);
