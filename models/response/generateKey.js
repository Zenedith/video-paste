//var
//  log = require(process.env.APP_PATH + "/lib/log");

var generateKey = function (keyObj)
{
//  log.debug('generateKey.construct()');

  this.key = keyObj.getId();
};

exports.generateKey = generateKey;
