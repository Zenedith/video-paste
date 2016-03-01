var logger = require('winston');
var config = require('config');
var logLevel = process.env.LOG_LEVEL || 'info';

if (config.loggly && !logger.transports.Loggly) {
  var Loggly = require('winston-loggly').Loggly;

  logger.add(Loggly, config.loggly);
}

logger.level = logLevel;

if (process.env.LOG_STREAM) {
  logger.add(logger.transports.File, {
      filename: process.env.LOG_STREAM,
      level: logLevel
    }
  );
}

module.exports.changeLogLevel = function (logLevel) {
  logger.level = logLevel;
};

logger.args = function args(msg, args) {
  var argsObj = {};
  var argList = /\(([^)]*)/.exec(args.callee)[1].split(',');
  for (var i in argList) {
    if (typeof args[i] === 'function') {
      argsObj[argList[i]] = 'function';
    }
    else {
      argsObj[argList[i]] = args[i];
    }
  }

  logger.info(msg, argsObj);
};


module.exports.logger = logger;