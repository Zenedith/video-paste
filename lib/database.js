var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log"),
  secure = require("node-secure");

const Database = (function(){
  var
    db_client = null,
    ctr = function() {
      log.debug('Database.construct()');

      if (config.db.use === "redis") {
        var Database_Redis = require(process.env.APP_PATH + "/lib/database/redis").Database_Redis;
        db_client = new Database_Redis();
      }
      else {
        throw new Error('Database: no database selected');
      }

    };

  return {
    save: function (object, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.save(object, callback);
    }
  };
})();

exports.Database = Database;
secure.secureMethods(exports);
