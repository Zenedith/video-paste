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

    new ctr();

  return {
    saveObject: function (object, callback) {
      db_client.saveObject(object, callback);
    },
    incrObject: function (object, field, callback) {
      db_client.incrObject(object, field, callback);
    },
    decrObject: function (object, field, callback) {
      db_client.decrObject(object, field, callback);
    },
    getObjectIdByUniqeKey: function (object, uniqValues, callback) {
      db_client.getObjectIdByUniqeKey(object, uniqValues, callback);
    },
    getObjectValue: function (object, field, callback) {
      db_client.getObjectValue(object, field, callback);
    },
    getManyObjectValues: function (object, ids, field, callback) {
      db_client.getManyObjectValues(object, ids, field, callback);
    },
    setObjectValue: function (object, field, value, callback) {
      db_client.setObjectValue(object, field, value, callback);
    },
    addObjectScore: function (object, field, callback) {
      db_client.addObjectScore(object, field, callback);
    },
    incrObjectScore: function (object, field, incrValue, callback) {
      db_client.incrObjectScore(object, field, incrValue, callback);
    },
    getObjectScoreList: function (object, field, start, stop, callback) {
      db_client.getObjectScoreList(object, field, start, stop, callback);
    },
    getObjectScoreCount: function (object, field, min, max, callback) {
      db_client.getObjectScoreCount(object, field, min, max, callback);
    },
    loadObject: function (object, callback) {
      db_client.loadObject(object, callback);
    },
    loadManyObjects: function (object, ids, callback) {
      db_client.loadManyObjects(object, ids, callback);
    },
    isValueInSet: function (setName, value, callback) {
      db_client.isValueInSet(setName, value, callback);
    },
    addValueToSet: function (setName, value, callback) {
      db_client.addValueToSet(setName, value, callback);
    },
    getValuesFromSet: function (setName, callback) {
      db_client.getValuesFromSet(setName, callback);
    },
    getSortedValuesFromSet: function (setName, by, offset, count, order, callback) {
      db_client.getSortedValuesFromSet(setName, by, offset, count, order, callback);
    },
    removeValueFromSet: function (setName, value, callback) {
      db_client.removeValueFromSet(setName, value, callback);
    },
    countValuesInSet: function(setName, callback) {
      db_client.countValuesInSet(setName, callback);
    },
    appendValueToList: function (listName, value, callback) {
      db_client.appendValueToList(listName, value, callback);
    },
    prependValueToList: function (listName, value, callback) {
      db_client.prependValueToList(listName, value, callback);
    },
    getValuesFromList: function (listName, start, stop, callback) {
      db_client.getValuesFromList(listName, start, stop, callback);
    },
    getManyValuesFromLists: function (listNames, start, stop, callback) {
      db_client.getManyValuesFromLists(listNames, start, stop, callback);
    }
  };
})();

exports.Database = Database;
secure.secureMethods(exports);
