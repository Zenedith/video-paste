var
    config = require('config'),
    log = require(process.env.APP_PATH + "/lib/logger").logger,
    secure = require("node-secure");

const Database = (function () {
    var
        db_client = null,
        ctr = function () {
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
        changeScoreValue: function (scoreSetName, value, changeScore, callback) {
            db_client.changeScoreValue(scoreSetName, value, changeScore, callback);
        },
        isValueInScore: function (scoreSetName, value, callback) {
            db_client.isValueInScore(scoreSetName, value, callback);
        },
        getScoreForValue: function (scoreSetName, value, callback) {
            db_client.getScoreForValue(scoreSetName, value, callback);
        },
        getScoreList: function (scoreSetName, start, stop, callback) {
            db_client.getScoreList(scoreSetName, start, stop, callback);
        },
        getCountScoreList: function (scoreSetName, min, max, callback) {
            db_client.getCountScoreList(scoreSetName, min, max, callback);
        },
        getScoreForManyValues: function (scoreSetName, values, callback) {
            db_client.getScoreForManyValues(scoreSetName, values, callback);
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
        addManyValuesToSet: function (setName, values, callback) {
            db_client.addManyValuesToSet(setName, values, callback);
        },
        addManyValuesToManySets: function (setValuesObj, callback) {
            db_client.addManyValuesToManySets(setValuesObj, callback);
        },
        getValuesFromSet: function (setName, callback) {
            db_client.getValuesFromSet(setName, callback);
        },
        getSortedValuesFromSet: function (setName, offset, count, order, callback) {
            db_client.getSortedValuesFromSet(setName, offset, count, order, callback);
        },
        getSortedValuesFromSetByString: function (setName, offset, count, order, callback) {
            db_client.getSortedValuesFromSetByString(setName, offset, count, order, callback);
        },
        removeValueFromSet: function (setName, value, callback) {
            db_client.removeValueFromSet(setName, value, callback);
        },
        countValuesInSet: function (setName, callback) {
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
        },
        batch: function (batchData, callback) {
            db_client.batch(batchData, callback);
        },
        set: function (key, value, callback) {
            db_client.set(key, value, callback);
        },
        get: function (key, callback) {
            db_client.get(key, callback);
        },
        setValues: function (key, values, callback) {
            db_client.setValues(key, values, callback);
        },
        getValues: function (key, callback) {
            db_client.getValues(key, callback);
        },
        quit: function () {
            db_client.quit();
        }
    };
})();

exports.Database = Database;
secure.secureMethods(exports);
