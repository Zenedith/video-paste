var
  redis = require('redis'),
  log = require(process.env.APP_PATH + "/lib/log"),
  config = require('config'),
  util = require('util'),
  secure = require("node-secure");

var Database_Redis = function ()
{
  log.debug('Database_Redis.construct()');

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

  //set error handling (when it is triggered?!)
  this.client.on("error", function (err) {
    log.error("Database_Redis: Redis Error: " + err);
//    console.log("Database_Redis: Redis Error: " + err);
  });

  this._saveObject = function (obj, callback) {
    log.debug('Database_Redis._saveObject()');

    if (!obj.getId()) {
      return callback(error(500, 'Trying to save with no id'), null);
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
      return callback(err, obj); //call by hand beacuse in result will be OK string
    });
  };


  this._createUniqKey = function (classname, uniqKeys, uniqValues) {

    var
      uniq_key = this.prefix + ':' + classname + ':uniq';

    //iterate all preperties
    for (var lp in uniqKeys) {
      uniq_key += util.format(':%s:%s', uniqKeys[lp], uniqValues[lp]);
    }

    return uniq_key;
  };

  this._createFieldKey = function (classname, id, field) {
    return this.prefix + ':' + classname + ':' + id + ':' + field;
  };

  this._createSetNameKey = function (setName) {
    return this.prefix + ':' + setName;
  };

  this._createListNameKey = function (listName) {
    return this.prefix + ':' + listName;
  };

  this._createScoreSetNameKey = function (scoreSetName) {
    return this.prefix + ':' + scoreSetName;
  };

};

//LIST///////////////////////////////

Database_Redis.prototype.appendValueToList = function (listName, value, callback) {
  log.debug('Database_Redis.appendValueToList(' + listName + ', ' + value + ')');

  this.client.rpush(this._createListNameKey(listName), value, callback);
};

Database_Redis.prototype.prependValueToList = function (listName, value, callback) {
  log.debug('Database_Redis.prependValueToList(' + listName + ', ' + value + ')');

  this.client.lpush(this._createListNameKey(listName), value, callback);
};

Database_Redis.prototype.getValuesFromList = function (listName, start, stop, callback) {
  log.debug('Database_Redis.getValuesFromList(' + listName + ', ' + start + ', ' + stop + ')');

  //if we want n elem, then stop must be set to n - 1
  if (stop > 0) {
    --stop;
  }

  this.client.lrange(this._createListNameKey(listName), start, stop, callback);
};


//returns {} with key => value
Database_Redis.prototype.getManyValuesFromLists = function (listNames, start, stop, callback) {
  log.debug('Database_Redis.getManyValuesFromLists(' + listNames + ', ' + start + ', ' + stop + ')');

  if (!listNames) {
    return callback(error(500, 'Missing listNames param'), null);
  }

  //if we want n elem, then stop must be set to n - 1
  if (stop > 0) {
    --stop;
  }

  var
    lrangeArray = [];

  //iterate all ids
  for (var lp in listNames) {
    lrangeArray.push(['lrange', this._createListNameKey(listNames[lp]), start, stop]);
  }

  this.client.multi(lrangeArray).exec(function (err, result) {

    if (err) {
      return callback(err, null);
    }

    var
      data = {};

    //iterate all preperties in all objs
    for (var lp in result) {

      var
        listName = listNames[lp];

      data[listName] = result[lp];
    }

    return callback(err, data);
  });
};


//LIST END///////////////////////////////

//SET///////////////////////////////
Database_Redis.prototype.getSortedValuesFromSet = function (setName, offset, count, order, callback) {
  log.debug('Database_Redis.getSortedValuesFromSet(' + setName + ', ' + offset + ', ' + count + ', ' + order + ')');

//something wrong when using "by" and ordering!
//  this.client.sort(this._createSetNameKey(setName), "by", by, 'limit', offset, count, order, callback);
  this.client.sort(this._createSetNameKey(setName), 'limit', offset, count, order, callback);
};

Database_Redis.prototype.countValuesInSet = function (setName, callback) {
  log.debug('Database_Redis.countValuesInSet(' + setName + ')');

  this.client.scard(this._createSetNameKey(setName), callback);
};

Database_Redis.prototype.getValuesFromSet = function (setName, callback) {
  log.debug('Database_Redis.getValuesFromSet(' + setName + ')');

  this.client.smembers(this._createSetNameKey(setName), callback);
};

Database_Redis.prototype.isValueInSet = function (setName, value, callback) {
  log.debug('Database_Redis.isValueInSet(' + setName + ', ' + value + ')');

  this.client.sismember(this._createSetNameKey(setName), value, callback);
};

Database_Redis.prototype.removeValueFromSet = function (setName, value, callback) {
  log.debug('Database_Redis.removeValueFromSet(' + setName + ', ' + value + ')');

  this.client.srem(this._createSetNameKey(setName), value, callback);
};

Database_Redis.prototype.addValueToSet = function (setName, value, callback) {
  log.debug('Database_Redis.addValueToSet(' + setName + ', ' + value + ')');

  this.client.sadd(this._createSetNameKey(setName), value, callback);
};

Database_Redis.prototype.addManyValuesToSet = function (setName, values, callback) {
  log.debug('Database_Redis.addManyValuesToSet(' + setName + ')');

  values.unshift('sadd', this._createSetNameKey(setName)); //add on beginign

  this.client.multi([values]).exec(callback);
};

//save object like {'setName': [values]} or {'setName': value} in sets
Database_Redis.prototype.addManyValuesToManySets = function (setValuesObj, callback) {
  log.debug('Database_Redis.addManyValuesToManySets()');

  var
    saddArray = [];

  for (var setName in setValuesObj) {
    if (setValuesObj.hasOwnProperty(setName) && typeof(setValuesObj[setName]) !== "function") {
      var
        value = setValuesObj[setName];

      setName = this._createSetNameKey(setName);

      if (util.isArray(value)) {
        value.unshift('sadd', setName); //add on beginign
        saddArray.push(value);
      }
      else {
        saddArray.push(['sadd', setName, value]);
      }
    }
  }

  this.client.multi(saddArray).exec(callback);
};

//SET END///////////////////////////////

//BASE///////////////////////////////


Database_Redis.prototype.batch = function (batchData, callback) {
  log.debug('Database_Redis.batch()');

  var
    multiData = [];

  for ( var lp in batchData) {

    for ( var type in batchData[lp]) {

      for ( var lpp in batchData[lp][type]) {
        var row = [ type ], key = '', data = batchData[lp][type][lpp];

        switch (type) {
          //TODO
          case 'get':
            key = this._createFieldKey(data[0], data[1], data[2]);
            row.push(key);
            break;
          case 'zscore':
            key = this._createScoreSetNameKey(data[0]);
            row.push(key);
            row.push(data[1]);
            break;
          case 'lrange':
            key = this._createListNameKey(data[0]);
            row.push(key);
            row.push(data[1]);
            row.push(data[2]);
            break;
        }

        multiData.push(row);
      }
    }
  }

  this.client.multi(multiData).exec(function (err, result) {

    if (err) {
      return callback(err, null);
    }

    var
      data = {};

    result.reverse(); //reverse order beacuse we use pop() array method

    for (var lp in batchData) {
      data[lp] = [];

      for (var type in batchData[lp]) {

        for (var lpp in batchData[lp][type]) {
          data[lp].push(result.pop());
        }
      }
    }

    return callback(null, data);
  });
};

Database_Redis.prototype.saveObject = function (obj, callback) {
  log.debug('Database_Redis.saveObject()');

  //if object have id then update
  if (obj.getId()) {
    this._saveObject(obj, callback);
  }
  else {

    var
      _this = this,
      classname = obj.getClassName();

    //Get a new id for the obj
    this.client.incr(this.prefix + ':' + classname + '_autoincrement', function(err, id){
      obj.setId(id);

      if (err) {
        return callback(err, null);
      }

      _this._saveObject(obj, callback);
    });
  }

};

Database_Redis.prototype.getObjectValue = function (obj, field, callback) {
  log.debug('Database_Redis.getObjectValue()');

  var
    classname = obj.getClassName();

  this.client.get(this._createFieldKey(classname, obj.getId(), field), function(err, res) {
    if (err) {
      return callback(err, null);
    }

    obj[field] = res;
    return callback(null, obj);
  });
};

//returns {} with key => value
Database_Redis.prototype.getManyObjectValues = function (obj, ids, field, callback) {
  log.debug('Database_Redis.getManyObjectValues()');

  var
    classname = obj.getClassName(),
    mget = ['mget'];

  //iterate all ids
  for (var lp in ids) {
    mget.push(this._createFieldKey(classname, ids[lp], field));
  }

  this.client.multi([mget]).exec(function (err, result) {

    if (err) {
      return callback(err, null);
    }

    result = result[0]; //get first array result

    var
      ret = {}; //return object, key => value

    //iterate all ids
    for (var lp in ids) {
      ret[ids[lp]] = result[lp];
    }

    return callback(null, ret);
  });
};

Database_Redis.prototype.setObjectValue = function (obj, field, value, callback) {
  log.debug('Database_Redis.setObjectValue()');

  var
    classname = obj.getClassName();

  this.client.set(this._createFieldKey(classname, obj.getId(), field), value, function(err, res) {
    return callback(err, obj);
  });
};

Database_Redis.prototype.incrObject = function (obj, field, callback) {
  log.debug('Database_Redis.incrObject()');

  var
    classname = obj.getClassName();

  this.client.incr(this._createFieldKey(classname, obj.getId(), field), function(err, res) {
    if (err) {
      return callback(err, null);
    }

    obj[field] = res;
    return callback(err, obj);
  });
};

Database_Redis.prototype.decrObject = function (obj, field, callback) {
  log.debug('Database_Redis.decrObject()');

  var
    classname = obj.getClassName();

  this.client.decr(this._createFieldKey(classname, obj.getId(), field), function(err, res) {
    if (err) {
      return callback(err, null);
    }

    obj[field] = res;
    return callback(err, obj);
  });
};

Database_Redis.prototype.loadObject = function (obj, callback) {
  log.debug('Database_Redis.loadObject()');

  var
    objKeys = [],
    classname = obj.getClassName(),
    mget = ['mget'];

  //load obj keys to array
  for (var k in obj) {
    if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
      objKeys.push(k);
    }
  }

  //iterate all preperties
  for (var k in objKeys) {
    mget.push(this._createFieldKey(classname, obj.getId(), objKeys[k]));
  }

  this.client.multi([mget]).exec(function (err, result) {

    if (err) {
      return callback(err, null);
    }

    result = result[0]; //get first array result
    result.reverse(); //reverse order beacuse we use pop() array method

    var
      notFound = true;

    //iterate all preperties
    for (var k in objKeys) {
      obj[objKeys[k]] = result.pop();

      if (obj[objKeys[k]] !== null) {  //check if is not null
        notFound = false;
      }
    }

    //if all of loaded properties are null then item not found
    if (notFound) {
      obj = null;
    }

    return callback(err, obj);
  });
};

Database_Redis.prototype.loadManyObjects = function (obj, ids, callback) {
  log.debug('Database_Redis.loadManyObjects()');

  var
    classname = obj.getClassName(),
    data = [],
    objKeys = [],
    mgetArray = [];


  //load obj keys to array
  for (var k in obj) {
    if (obj.hasOwnProperty(k) && typeof(obj[k]) !== "function") {
      objKeys.push(k);
    }
  }

  //iterate all preperties for all ids
  for (var lp in ids) {
    var
      mget = [];

    mget.push('mget');

    for (var k in objKeys) {
      mget.push(this._createFieldKey(classname, ids[lp], objKeys[k]));
    }

    mgetArray.push(mget);
  }

  this.client.multi(mgetArray).exec(function (err, result) {

    if (err) {
      return callback(err, null);
    }

    //iterate all preperties in all objs
    for (var lp in result) {
      var
       //p_obj = {};  //TODO clone obj!
       p_obj = Object.create(obj);

      result[lp].reverse(); //reverse order beacuse we use pop() array method

      for (var k in objKeys) {
        var val = result[lp].pop();
        p_obj[objKeys[k]] = val;
      }

      p_obj['__id'] = ids[lp];  //add id from ids, beacause we dont save id (it is present in keyname)
      data.push(p_obj);
    }

    return callback(err, data);
  });
};

Database_Redis.prototype.getObjectIdByUniqeKey = function (obj, uniqValues, callback) {
  log.debug('Database_Redis.getObjectIdByUniqeKey()');

  var
    classname = obj.getClassName(),
    uniqKeys = obj.getUniqeKeys(),
    uniq = this._createUniqKey(classname, uniqKeys, uniqValues);

  this.client.get(uniq, callback);
};

//BASE END///////////////////////////////

//SORTED SET///////////////////////////////
Database_Redis.prototype.isValueInScore = function (scoreSetName, value, callback) {
  log.debug('Database_Redis.isValueInScore(' + scoreSetName + ', ' + value + ')');

  this.client.zrank(this._createScoreSetNameKey(scoreSetName), value, callback);
};

Database_Redis.prototype.changeScoreValue = function (scoreSetName, value, changeScore, callback) {
  log.debug('Database_Redis.changeScoreValue(' + scoreSetName + ', ' + value + ', ' + changeScore + ')');

  this.client.zincrby(this._createScoreSetNameKey(scoreSetName), changeScore, value, callback);
};

Database_Redis.prototype.getScoreForValue = function (scoreSetName, value, callback) {
  log.debug('Database_Redis.getScoreForValue(' + scoreSetName + ', ' + value + ')');

  this.client.zscore(this._createScoreSetNameKey(scoreSetName), value, callback);
};

Database_Redis.prototype.getScoreForManyValues = function (scoreSetName, values, callback) {
  log.debug('Database_Redis.getScoreForManyValues(' + scoreSetName + ')');

  var
    zscoreArray = [];

  //iterate all ids
  for (var lp in values) {
    zscoreArray.push(['zscore', this._createScoreSetNameKey(scoreSetName), values[lp]]);
  }

  this.client.multi(zscoreArray).exec(function (err, result) {

    if (err) {
      return callback(err, null);
    }

    var
      data = {};

    //iterate all preperties in all objs
    for (var lp in result) {

      var
        val = values[lp];

      data[val] = result[lp];
    }

    return callback(err, data);
  });
};

Database_Redis.prototype.getScoreList = function (scoreSetName, start, stop, callback) {
  log.debug('Database_Redis.getScoreList(' + scoreSetName + ')');

  //if we want n elem, then stop must be set to n - 1
  if (stop > 0) {
    --stop;
  }

  this.client.zrevrange(this._createScoreSetNameKey(scoreSetName), start, stop, callback);
};

Database_Redis.prototype.getCountScoreList = function (scoreSetName, min, max, callback) {
  log.debug('Database_Redis.getCountScoreList(' + scoreSetName + ')');

  if (min < 0) {
    min = '-inf';
  }

  if (max < 0) {
    max = '+inf';
  }

  this.client.zcount(this._createScoreSetNameKey(scoreSetName), min, max, callback);
};


//SORTED SET END///////////////////////////////


exports.Database_Redis = Database_Redis;
secure.secureMethods(exports);
