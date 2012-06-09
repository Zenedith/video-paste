//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getSession = function (sessObj)
{
//  log.debug('getSession.construct()');

  this.sess = sessObj.getId();
  this.userId = parseInt(sessObj.getUserId());
};

exports.getSession = getSession;
