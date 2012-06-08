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
      classname = obj.getClassName(),
      uniqValues = [],
      uniqKeys = obj.getUniqeKeys(),
      mset = ['mset'];    //TODO or HMSET??

    //iterate all preperties
    for (var k in obj) {
      if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
        mset.push(this._createFieldKey(classname, obj.getId(), k));
        mset.push(obj[k]);
      }
    }

    //if uniq keys present then get uniq values from object
    if (uniqKeys.length > 0) {
      for (var k in uniqKeys) {
        if (obj.hasOwnProperty(uniqKeys[k])) {
          uniqValues.push(obj[uniqKeys[k]]);
        }
      }

      mset.push(this._createUniqKey(classname, uniqKeys, uniqValues));  //add key
      mset.push(obj.getId()); //add value
    }

    this.client.multi([mset]).exec(function (err, result) {
//      console.log(err, result);
      callback(err, obj); //call by hand beacuse in result will be OK string
    });
  };


  this._createUniqKey = function (classname, uniqKeys, uniqValues) {

    var
      uniq_key = this.prefix + ':' + classname + ':uniq';

    //iterate all preperties
    for (var lp in uniqKeys) {
      uniq_key += ':';
      uniq_key += uniqKeys[lp];
      uniq_key += ':';
      uniq_key += uniqValues[lp];
    }

    return uniq_key;
  };

  this._createFieldKey = function (classname, id, field) {
    return this.prefix + ':' + classname + ':' + id + ':' + field;
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

Database_Redis.prototype.getValue = function (obj, field, callback) {
  log.debug('Database_Redis.getValue()');

  var
    classname = obj.getClassName();

  this.client.get(this._createFieldKey(classname, obj.getId(), field), function(err, res) {
    if (err) {
      return callback(err, obj);
    }

    obj[field] = res;
    callback(err, obj);
  });
};

Database_Redis.prototype.setValue = function (obj, field, value, callback) {
  log.debug('Database_Redis.getValue()');

  var
    classname = obj.getClassName();

  this.client.set(this._createFieldKey(classname, obj.getId(), field), value, function(err, res) {
    if (err) {
      return callback(err, obj);
    }

    callback(err, obj);
  });
};

Database_Redis.prototype.incr = function (obj, field, callback) {
  log.debug('Database_Redis.incr()');

  var
    classname = obj.getClassName();

  this.client.incr(this._createFieldKey(classname, obj.getId(), field), function(err, res) {
    if (err) {
      return callback(err, obj);
    }

    obj[field] = res;
    callback(err, obj);
  });
};

Database_Redis.prototype.decr = function (obj, field, callback) {
  log.debug('Database_Redis.decr()');

  var
    classname = obj.getClassName();

  this.client.decr(this._createFieldKey(classname, obj.getId(), field), function(err, res) {
    if (err) {
      return callback(err, obj);
    }

    obj[field] = res;
    callback(err, obj);
  });
};

Database_Redis.prototype.addScore = function (obj, field, callback) {
  log.debug('Database_Redis.addScore()');

  var
    classname = obj.getClassName(),
    score_set_name = classname + ':' + field + ':score',
    score = obj[field];

//  console.log(obj);
//  console.log(field);
//  console.log(score_set_name);
//  console.log(score);
//  console.log(obj.getId());

  this.client.zadd(score_set_name, score, obj.getId(), function(err, res) {
//    console.log(err, res);

    return callback(err, obj);
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
      mget.push(this._createFieldKey(classname, obj.getId(), k));
    }
  }

  this.client.multi([mget]).exec(function (err, result) {

    result = result[0]; //get first array result
    result.reverse(); //reverse order beacuse we use pop() array method

    var
      notFound = true;

    //iterate all preperties
    for (var k in obj) {
      if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
        obj[k] = result.pop();

        if (obj[k] !== null) {  //check if is not null
          notFound = false;
        }
      }
    }

    //if all of loaded properties are null then item not found
    if (notFound) {
      obj = null;
    }

    callback(err, obj);
  });
};

Database_Redis.prototype.getIdByUniqeKey = function (obj, uniqValues, callback) {
  log.debug('Database_Redis.getIdByUniqeKey()');

  var
    classname = obj.getClassName(),
    uniqKeys = obj.getUniqeKeys(),
    uniq = this._createUniqKey(classname, uniqKeys, uniqValues);

  this.client.get(uniq, function(err, res) {
    callback(err, res);
  });
};

exports.Database_Redis = Database_Redis;
secure.secureMethods(exports);
