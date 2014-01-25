var
    secure = require("node-secure");

var accountType = {
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
    TWITTER: 'twitter',
    WINDOWS_LIVE: 'live'
};

exports.accountType = accountType;
secure.secureMethods(exports);
