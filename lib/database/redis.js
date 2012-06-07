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

    //TODO use mset("test keys 1", "test val 1", "test keys 2", "test val 2", function (err, res) {});

    for (var k in obj) {
      if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
        trans.set(this.prefix + ':' + classname + ':' + obj.getId() + ':' + k, obj[k]);
      }
    }

    trans.lpush(this.prefix + ':' + classname, obj.getId());
    trans.exec(function(err) {
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
        return callback(err, obj);
      }

      _this._save(obj, callback);
    });
  }

};

Database_Redis.prototype.incr = function (obj, field, callback) {
  log.debug('Database_Redis.incr()');

  var
    classname = obj.getClassName();

//  console.log(this.prefix + ':' + classname + ':' + obj.getId() + ':' + field);

  this.client.incr(this.prefix + ':' + classname + ':' + obj.getId() + ':' + field, function(err, res) {
    if (err) {
      return callback(err, obj);
    }

    obj[field] = res;
    callback(err, obj);
  });
};

Database_Redis.prototype.load = function (obj, callback) {
  log.debug('Database_Redis.load()');

  var
    classname = obj.getClassName(),
    mget = ['mget'];

  //iterate all preperties
  for (var k in obj) {
    if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
      mget.push(this.prefix + ':' + classname + ':' + obj.getId() + ':' + k);
    }
  }

  this.client.multi([mget]).exec(function (err, result) {

    result = result[0]; //get first array result
    result.reverse(); //reverse order beacuse we use pop() array method

    //iterate all preperties
    for (var k in obj) {
      if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
        obj[k] = result.pop();
      }
    }

    callback(err, obj);
  });
};

exports.Database_Redis = Database_Redis;
secure.secureMethods(exports);
