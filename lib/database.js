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
    },
    incr: function (object, field, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.incr(object, field, callback);
    },
    decr: function (object, field, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.decr(object, field, callback);
    },
    getIdByUniqeKey: function (object, uniqValues, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.getIdByUniqeKey(object, uniqValues, callback);
    },
    getValue: function (object, field, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.getValue(object, field, callback);
    },
    setValue: function (object, field, value, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.setValue(object, field, value, callback);
    },
    addScore: function (object, field, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.addScore(object, field, callback);
    },
    getScoreList: function (object, field, start, stop, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.getScoreList(object, field, start, stop, callback);
    },
    getScoreCount: function (object, field, min, max, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.getScoreCount(object, field, min, max, callback);
    },
    load: function (object, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.load(object, callback);
    },
    loadMany: function (object, ids, callback) {
      //check instance
      if (!db_client) {
        var instance = new ctr();
      }

      db_client.loadMany(object, ids, callback);
    }
  };
})();

exports.Database = Database;
secure.secureMethods(exports);
