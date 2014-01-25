var
    Database = require(process.env.APP_PATH + "/lib/database").Database,
    log = require(process.env.APP_PATH + "/lib/log"),
    LRU = require('lru-cache'),
    secure = require("node-secure");

var Restify_TokensTable_Database = (function () {

    var
        TOKEN_HASH_KEY = 'RTT',
        lruStorage = new LRU(10000); //recent 10k IPs

    //init
    //get keys values from database
//  Database.getValues(TOKEN_HASH_KEY + ':keys', function(err, data) {
//    if (err) {
//      throw err;
//    }
//    
//    var
//      queries = [];
//    
//    for (var i in data) {
//      queries.push([TOKEN_HASH_KEY + ':' + data[i]]);
//    }
//    
//    Database.batch([{'hgetall' : queries}], function (err, resBatch) {
//
//      for (var i in data) {
//        var
//          key = data[i],
//          value = resBatch[i];
//
//TODO cast value to TokenBucket class object
//        lruStorage.set(key, value);
//      }
//    });
//  });

    return {
        updateDatabase: function (callback) {
//      log.debug('Restify_TokensTable_Database.updateDatabase');
//
//      var
//        dump = lruStorage.dump(),
//        queries = [];
//      
//      queries.push([TOKEN_HASH_KEY + ':keys', Object.keys(dump)]);
//      
//      for (var i in dump) {
//        queries.push([TOKEN_HASH_KEY + ':' + i, dump[i].value]);
//      }
//
//      //save dumped values
//      Database.batch([{'hmset' : queries}], callback);
        },
        put: function (key, value) {
            lruStorage.set(key, value);
        },
        get: function (key) {
            return lruStorage.get(key);
        }
    };
})();

exports.Restify_TokensTable_Database = Restify_TokensTable_Database;
secure.secureMethods(exports);
