var
  secure = require("node-secure");

var accountType = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google'
};

exports.accountType = accountType;
secure.secureMethods(exports);
