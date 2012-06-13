var
  secure = require("node-secure");

var accountType = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
  TWITTER: 'twitter'
};

exports.accountType = accountType;
secure.secureMethods(exports);
