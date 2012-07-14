var
  serverInit = require(__dirname + '/server-init'),
  Api = require(process.env.APP_PATH + '/vhost/api').Api,
  api = Api(),
  WebSocketApp = require(process.env.APP_PATH + '/vhost/webSocketApp').WebSocketApp,
  app = WebSocketApp(api),  //TEMP hack to use one app to serve content and api (dotcloud subdomain problem)
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log");

module.exports.app = app;
module.exports.api = api;
module.exports.port = serverInit.port;

if (!module.parent) {
  var
    express = require('express'),
    vhost = express.createServer();
  
  vhost.use(express.favicon()); //serve favicon globally
  
  vhost.use(express.vhost(config.app.host, app)); //app
  vhost.use(express.vhost('api.' + config.app.host, api));  //api

  vhost.listen(serverInit.port, serverInit.ipaddr, function () {
    log.debug('%s: Node server started on %s:%d ...', Date(Date.now() ), serverInit.ipaddr, serverInit.port);
    log.debug("Express server listening on port %d in %s mode", serverInit.port, process.env.NODE_ENV);
  });
}