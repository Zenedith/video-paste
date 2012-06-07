//var
//  log = require(process.env.APP_PATH + "/lib/log");

var getSession = function (sessObj)
{
//  log.debug('getSession.construct()');

  this.sess = sessObj.getId();
};

exports.getSession = getSession;
