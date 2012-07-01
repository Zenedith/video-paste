#!/bin/env node
// OpenShift Node application

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

if (!process.env.APP_PATH) {
  process.env.APP_PATH = __dirname;
}

var
  WebSocketApp = require(process.env.APP_PATH + '/vhost/webSocketApp').WebSocketApp,
  app = WebSocketApp(),
  Api = require(process.env.APP_PATH + '/vhost/api').Api,
  api = Api(),
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
  throw err;
  log.debug('%s: Received uncaughtException: %s', Date(Date.now()), err); 
});

//Process on exit and signals.
process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function(err) { terminator(element, err); });
});

module.exports.app = app;
module.exports.api = api;
module.exports.port = port;

if (!module.parent) {
  var
    express = require('express'),
    vhost = express.createServer();

  vhost.use(express.favicon()); //serve favicon globally
  
  vhost.use(express.vhost(config.app.host, app)); //app
  vhost.use(express.vhost('api.' + config.app.host, api));  //api

  vhost.listen(port, ipaddr, function () {
     log.debug('%s: Node server started on %s:%d ...', Date(Date.now() ), ipaddr, port);
     log.debug("Express server listening on port %d in %s mode", port, vhost.settings.env);
  });
}