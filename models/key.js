var
    Base = require(process.env.APP_PATH + "/models/base").Base,
    log = require(process.env.APP_PATH + "/lib/log"),
//  util = require("util"),
    secure = require("node-secure");

var Key = function () {
    log.debug('Key.construct()');

    var KEY_LIFETIME = 31104000;
    var KEY_VERSION = 1;

    this.__className = "Key";
    this.__lifetime = 0;
    this.__version = 0;
    this.__lastUsed = 0;

    this.generateKey = function () {
        log.debug('Key.generateKey()');
        var
            Key_Generator = require(process.env.APP_PATH + "/models/key/generator").Key_Generator,
            kgen = new Key_Generator(),
            current_timestamp = Math.round(+new Date() / 1000);

        this.setId(kgen.generateKey()); //id is a key!
        this.__lifetime = ~~(current_timestamp + KEY_LIFETIME);
        this.__version = KEY_VERSION;
        this.__lastUsed = ~~current_timestamp;

        log.debug('Key.generatedKey: %s', this.__id);
    };

    this.isValidKey = function (id, callback) {
        var
            sanitize = require('sanitizer'),
            validator = require('validator'),
            _this = this;

        id = sanitize.escape(id);

        try {
            validator.isLength(id, 16, 16);
        }
        catch (e) {
            return callback(error(602, 'invalid api key: ' + e.message), null);
        }

        this.load(id, function (err, obj) {

            if (err || obj === null) {
                return callback(error(602, 'invalid api key'), null);
            }

            var
                current_timestamp = Math.round(+new Date() / 1000);

            //check expiration time
            if (obj.getLifeTime() < current_timestamp) {
                //TODO remove key
                return callback(error(602, 'key has expired'), null);
            }

            //async: update last used
            _this.setObjectValueToDB(id, '__lastUsed', current_timestamp, function (err2, obj) {
                if (err2) {
                    log.critical(err2);
                }
            });

            //don't wait to update last used time
            return callback(null, obj);
        });

    };
};

Key.prototype.getLifeTime = function () {
    return ~~this.__lifetime;
};

//extending base class
//util.inherits(Key, Base);
Key.prototype.__proto__ = Base.prototype;


exports.Key = Key;
secure.secureMethods(exports);
