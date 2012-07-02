var
  serverInit = require(__dirname + '/server-init'),
  Api = require(process.env.APP_PATH + '/vhost/api').Api,
  api = Api(),
  log = require(process.env.APP_PATH + "/lib/log");

if (!module.parent) {
  api.listen(serverInit.port, serverInit.ipaddr, function () {
    log.debug('%s: Node server started on %s:%d ...', Date(Date.now() ), serverInit.ipaddr, serverInit.port);
    log.debug("Express server listening on port %d in %s mode", serverInit.port, process.env.NODE_ENV);
  });
}