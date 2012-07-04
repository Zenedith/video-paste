#!/bin/env node
// OpenShift Node application

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname;
}

var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  Errors = require(process.env.APP_PATH + "/models/errors").Errors;

//global
global.error = Errors;

//global
global.__t = function(str)
{
  return str;
};

if (process.env.NODE_ENV === 'dotcloud') {
  var fs = require('fs');
  var env = JSON.parse(fs.readFileSync('environment.json', 'utf-8'));

  config.app.port = env.PORT_WWW; // override port
  config.db.use = "redis";
  config.db.redis.host = env.DOTCLOUD_DATA_REDIS_HOST; // override redis host
  config.db.redis.port = env.DOTCLOUD_DATA_REDIS_PORT; // override redis port
  config.db.redis.auth = env.DOTCLOUD_DATA_REDIS_PASSWORD; // override redis
  // auth
}

//check strider deploy config
if (process.env.REDIS_PORT) {
  config.db.redis.host = process.env.REDIS_HOST; // override redis host
  config.db.redis.port = process.env.REDIS_PORT; // override redis port
  config.db.redis.auth = process.env.REDIS_PASSWORD; // override redis  
}

var
  ipaddr = config.app.host || '0.0.0.0',
  port = config.app.port || process.env.app_port || process.env.PORT;

if (process.env.OPENSHIFT_INTERNAL_IP) {
  ipaddr = process.env.OPENSHIFT_INTERNAL_IP;
  port = process.env.OPENSHIFT_INTERNAL_PORT;
}

// terminator === the termination handler.
function terminator(sig, err) {
  err = err || '';

    if (typeof sig === "string") {      
      log.debug('%s: Received %s (%s)- terminating Node server ...', Date(Date.now()), sig, err);
      process.exit(1);
    }

   log.debug('%s: Node server stopped.', Date(Date.now()) );
}

//handle uncaughtException (dont exit!)
process.on('uncaughtException', function(err) { 
  log.debug('%s: Received uncaughtException: %s', Date(Date.now()), err); 
});

//Process on exit and signals.
process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function(err) { terminator(element, err); });
});

module.exports.ipaddr = ipaddr;
module.exports.port = port;