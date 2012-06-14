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
    saveObject: function (object, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.saveObject(object, callback);
    },
    incrObject: function (object, field, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.incrObject(object, field, callback);
    },
    decrObject: function (object, field, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.decrObject(object, field, callback);
    },
    getObjectIdByUniqeKey: function (object, uniqValues, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.getObjectIdByUniqeKey(object, uniqValues, callback);
    },
    getObjectValue: function (object, field, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.getObjectValue(object, field, callback);
    },
    getManyObjectValues: function (object, ids, field, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.getManyObjectValues(object, ids, field, callback);
    },
    setObjectValue: function (object, field, value, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.setObjectValue(object, field, value, callback);
    },
    addObjectScore: function (object, field, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.addObjectScore(object, field, callback);
    },
    incrObjectScore: function (object, field, incrValue, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.incrObjectScore(object, field, incrValue, callback);
    },
    getObjectScoreList: function (object, field, start, stop, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.getObjectScoreList(object, field, start, stop, callback);
    },
    getObjectScoreCount: function (object, field, min, max, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.getObjectScoreCount(object, field, min, max, callback);
    },
    loadObject: function (object, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.loadObject(object, callback);
    },
    loadManyObjects: function (object, ids, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.loadManyObjects(object, ids, callback);
    },
    isObjectInSet: function (object, setName, value, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.isObjectInSet(object, setName, value, callback);
    },
    addToObjectSet: function (object, setName, value, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.addToObjectSet(object, setName, value, callback);
    },
    getObjectsFromSet: function (object, setName, callback) {
      //check instance
      if (!db_client) {
        new ctr();
      }

      db_client.getObjectsFromSet(object, setName, callback);
    }
  };
})();

exports.Database = Database;
secure.secureMethods(exports);
