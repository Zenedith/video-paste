var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  secure = require("node-secure");

const RequestLogger = (function(io){
  var
    instance = null,
    clients = {},
    ctr = function() {
//      log.debug('RequestLogger.construct()');

      socketio.sockets.on('connection', function (client) {
        console.log('client connected: ' + client.id);

        clients[client.id] = client;

        client.on('disconnect', function () {
          delete clients[client.id];
          log.debug('client disconnected: ' + client.id);
        });

      });
    };

  return {
    update: function () {
      //check instance
      if (!instance) {
        instance = new ctr();
      }
    },
    log: function (req, data) {
      //check instance
      if (!instance) {
        instance = new ctr();
      }

      var
        post = {},  //must by a object
        qs = {};  //must by a object

      for (var k in req.params) {
        qs[k] = req.params[k];
      }

      for (var k in req.body) {
        post[k] = req.body[k];
      }

      var
        update = {url: req.url, qs: qs, post: post, json: JSON.stringify(data)};

      for (var clid in clients) {
        clients[clid].emit('update', update);
      }
    }
  };
})();

exports.RequestLogger = RequestLogger;
secure.secureMethods(exports);
