var
  ServerInit = require(__dirname + '/server-init').ServerInit,
  serverInit = ServerInit(),
  Api = require(process.env.APP_PATH + '/vhost/restify').Api,
  api = Api(),
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log");

if (!module.parent) {
  api.listen(config.app.port, config.app.host, function () {
    log.debug('%s: Node server started on %s:%d ...', new Date(Date.now() ), config.app.host, config.app.port);
    log.debug("Express server listening on port %d in %s mode", config.app.port, process.env.NODE_ENV);
  });
}