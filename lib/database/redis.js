var
  redis = require('redis'),
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  secure = require("node-secure");

var Database_Redis = function ()
{
  log.debug('this.construct()');

  //create
  this.client = redis.createClient(config.db.redis.port, config.db.redis.host);
  this.prefix = config.db.prefix;

  if (!this.client) {
    log.error('Database_Redis: Redis client null');
    throw Error('Redis client null');
  }

  //auth
  if (config.db.redis.auth) {
    this.client.auth(config.db.redis.auth, function() {
      log.debug('Database_Redis: Redis client auth finished');
    });
  }

  //set error handling
  this.client.on("error", function (err) {
    log.error("Database_Redis: Redis Error: " + err);
  });

  this._save = function (obj, callback) {
    log.debug('Database_Redis._save()');

    if (!obj.getId()) {
      log.error('Trying to save with no id');
      log.error(obj);
      throw new Error('Trying to save with no id');
    }

    var
      classname = obj.getClassName();

    //start transaction
    var trans = this.client.multi();

    for (var k in obj) {
      if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
        trans.set(this.prefix + ':' + classname + ':' + obj.getId() + ':' + k, obj[k]);
      }
    }

    trans.lpush(this.prefix + ':' + classname, obj.getId());
    trans.exec(function(err) {
      if (err) {
        throw err;
      }

      callback(err, obj);
    });
  };
};

Database_Redis.prototype.save = function (obj, callback) {
  log.debug('Database_Redis.save()');

  //if object have id then update
  if (obj.getId()) {
    this._save(obj, callback);
  }
  else {

    var
      _this = this,
      classname = obj.getClassName();

    //Get a new id for the obj
    this.client.incr(this.prefix + ':' + classname + '_autoincrement', function(err, id){
      obj.setId(id);

      if (err) {
        throw err;
      }

      _this._save(obj, callback);
    });
  }

};

exports.Database_Redis = Database_Redis;
secure.secureMethods(exports);
