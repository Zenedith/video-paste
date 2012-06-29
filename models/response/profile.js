//var
//  log = require(process.env.APP_PATH + "/lib/log");

var profile = function (userObj)
{
//  log.debug('profile.construct()');

  this.userId = ~~(userObj.getId());
  this.name = userObj.getName();
  this.fistName = userObj.getFirstName();
  this.lastName = userObj.getLastName();
  this.accountType = userObj.getAccountType();
  this.topPosts = [];
};

exports.profile = profile;
