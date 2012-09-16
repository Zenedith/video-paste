var
  ServerInit = require(__dirname + '/server-init').ServerInit,
  serverInit = ServerInit(),
  Api = require(process.env.APP_PATH + '/vhost/api').Api,
  api = Api(),
  WebSocketApp = require(process.env.APP_PATH + '/vhost/webSocketApp').WebSocketApp,
  app = WebSocketApp(api),  //TEMP hack to use one app to serve content and api (dotcloud subdomain problem)
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log");

module.exports.app = app;
module.exports.api = api;
module.exports.port = config.app.port;

if (!module.parent) {
  var
    express = require('express'),
    vhost = express();

  vhost.use(express.favicon()); //serve favicon globally
  
  vhost.use(express.vhost(config.app.host, app)); //app
  vhost.use(express.vhost('api.' + config.app.host, api));  //api

  vhost.listen(config.app.port, config.app.host, function () {
    log.debug('%s: Node server started on %s:%d ...', new Date(Date.now() ), config.app.host, config.app.port);
    log.debug("Express server listening on port %d in %s mode", config.app.port, process.env.NODE_ENV);
  });
}